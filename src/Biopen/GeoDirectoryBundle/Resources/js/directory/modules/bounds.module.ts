import { AppModule, AppStates } from "../app.module";
import { Element } from "../classes/element.class";

declare let App : AppModule;

export class BoundsModule
{
	// we extend visible viexport to load elements on this area, so the user see them directly when panning or zoom out
	extendedBounds : L.LatLngBounds;

	// the bounds where elements has already been retrieved
	// we save one filledBound per mainOptionId
	filledBound : L.LatLngBounds[] = [];

	initialize()
	{
		for(let mainOptionId of App.categoryModule.getMainOptionsIdsWithAll())
		{
			this.filledBound[mainOptionId] = null;
		}
	}	

	createBoundsFromLocation($location : L.LatLng, $radius = 30)
	{
		let degree = $radius / 110 / 2;
		this.extendedBounds = L.latLngBounds(L.latLng($location.lat - degree, $location.lng - degree), L.latLng($location.lat + degree, $location.lng + degree) );
	}

	extendBounds($ratio : number, $bounds : L.LatLngBounds = this.extendedBounds)
	{
		//console.log("extend bounds", $bounds);
		if (!$bounds) { console.log("bounds uncorrect", $bounds); return;}
		this.extendedBounds = $bounds.pad($ratio);
	}

	updateFilledBoundsAccordingToNewMainOptionId()
	{
		if (App.currMainId == 'all')
		{
			// let othersfilledBoundsNotEmpty = App.categoryModule.getMainOptionsIds().map( (id) => this.filledBound[id]).filter( (bound) => bound != null);

			// // getting the smallest
			// let west =  Math.max.apply(Math, othersfilledBoundsNotEmpty.map( (bound) => bound.getWest()));
			// let south = Math.max.apply(Math, othersfilledBoundsNotEmpty.map( (bound) => bound.getSouth()));
			// let east =  Math.min.apply(Math, othersfilledBoundsNotEmpty.map( (bound) => bound.getEast()));
			// let north = Math.min.apply(Math, othersfilledBoundsNotEmpty.map( (bound) => bound.getNorth()));


		}
		else if (this.filledBound['all'])
		{
			if (!this.currFilledBound || this.filledBound['all'].contains(this.filledBound[App.currMainId]))
			{
				this.filledBound[App.currMainId] = this.filledBound['all']
			}
		}
	}

	// implements this function to wait from ajax response to update new filledBounds, instead of
	// updating it before ajax send (possibly wrong if ajax fail)
	// updateFilledBoundsWithBoundsReceived(bound : L.LatLngBoundsExpression, mainOptionId : number)
	// {
	// 	this.filledBound[mainOptionId] = new L.latLngBounds(bound);
	// }

	get currFilledBound() { return this.filledBound[App.currMainId]; }

	calculateFreeBounds()
	{
		let freeBounds = [];

		let currFilledBound = this.currFilledBound;

		let freeBound1, freeBound2, freeBound3, freeBound4;

		if (currFilledBound)
		{
			if (!currFilledBound.contains(this.extendedBounds))
			{
				if (this.extendedBounds.contains(currFilledBound))
				{
					// extended contains filledbounds		

					freeBound1 = L.latLngBounds( this.extendedBounds.getNorthWest(), currFilledBound.getNorthEast() );
					freeBound2 = L.latLngBounds( freeBound1.getNorthEast()				 , this.extendedBounds.getSouthEast() );
					freeBound3 = L.latLngBounds( currFilledBound.getSouthEast()	 , this.extendedBounds.getSouthWest() );
					freeBound4 = L.latLngBounds( freeBound1.getSouthWest()				 , currFilledBound.getSouthWest() );

					currFilledBound = this.extendedBounds;

					freeBounds.push(freeBound1,freeBound2, freeBound3, freeBound4);					
				}
				else
				{
					// extended cross over filled

					if (this.extendedBounds.getWest() > currFilledBound.getWest() && this.extendedBounds.getEast() < currFilledBound.getEast())
					{
						if (this.extendedBounds.getSouth() < currFilledBound.getSouth())
						{
							// extended centered south from filledBounds
							freeBound1 = L.latLngBounds( this.extendedBounds.getSouthWest(), currFilledBound.getSouthEast() );
							
						}
						else
						{
							// extended centered south from filledBounds
							freeBound1 = L.latLngBounds( this.extendedBounds.getNorthWest(), currFilledBound.getNorthEast() );
						}
					}
					else if (this.extendedBounds.getWest() < currFilledBound.getWest())
					{
						if (this.extendedBounds.getSouth() > currFilledBound.getSouth() && this.extendedBounds.getNorth() < currFilledBound.getNorth())
						{
							// extended centered east from filledBounds
							freeBound1 = L.latLngBounds( this.extendedBounds.getNorthWest(), currFilledBound.getSouthWest() );
						}
						else if (this.extendedBounds.getSouth() < currFilledBound.getSouth())
						{
							// extendedbounds southWest from filledBounds
							freeBound1 = L.latLngBounds( currFilledBound.getSouthEast(), this.extendedBounds.getSouthWest() );
							freeBound2 = L.latLngBounds( currFilledBound.getNorthWest(), freeBound1.getNorthWest() );
						}
						else
						{
							// extendedbounds northWest from filledBounds
							freeBound1 = L.latLngBounds( currFilledBound.getNorthEast(), this.extendedBounds.getNorthWest() );
							freeBound2 = L.latLngBounds( currFilledBound.getSouthWest(), freeBound1.getSouthWest() );
						}
					}
					else
					{
						if (this.extendedBounds.getSouth() > currFilledBound.getSouth() && this.extendedBounds.getNorth() < currFilledBound.getNorth())
						{
							// extended centered west from filledBounds
							freeBound1 = L.latLngBounds( currFilledBound.getNorthEast(), this.extendedBounds.getSouthEast() ); 
						}
						else if (this.extendedBounds.getSouth() < currFilledBound.getSouth())
						{
							// extendedbounds southeast from filledBounds
							freeBound1 = L.latLngBounds( currFilledBound.getSouthWest(), this.extendedBounds.getSouthEast() );
							freeBound2 = L.latLngBounds( currFilledBound.getNorthEast(), freeBound1.getNorthEast() );
						}
						else
						{	
							// extendedbounds northEast from filledBounds
							freeBound1 = L.latLngBounds( currFilledBound.getNorthWest(), this.extendedBounds.getNorthEast() );
							freeBound2 = L.latLngBounds( currFilledBound.getSouthEast(), freeBound1.getSouthEast() );
						}
					}

					//L.rectangle(freeBound1, {color: "red", weight: 3}).addTo(this.map_); 
					//L.rectangle(freeBound2, {color: "blue", weight: 3}).addTo(this.map_); 

					freeBounds.push(freeBound1);
					if (freeBound2) freeBounds.push(freeBound2);		

					currFilledBound = L.latLngBounds( 
						L.latLng(
							Math.max(currFilledBound.getNorth(), this.extendedBounds.getNorth()),
							Math.max(currFilledBound.getEast(), this.extendedBounds.getEast())
						),
						L.latLng(
							Math.min(currFilledBound.getSouth(), this.extendedBounds.getSouth()),
							Math.min(currFilledBound.getWest(), this.extendedBounds.getWest()) 
						)						
					);		
				}					
			}
			else
			{
				// extended bounds included in filledbounds
				return null;
			}
		}
		else
		{
			// first initialization
			freeBounds.push(this.extendedBounds);
			currFilledBound = this.extendedBounds;
		}		

		this.filledBound[App.currMainId] = currFilledBound;

		return freeBounds;
	}
}