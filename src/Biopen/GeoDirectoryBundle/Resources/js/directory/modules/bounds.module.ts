import { AppModule, AppStates } from "../app.module";
import { Element } from "../classes/element.class";

declare let App : AppModule;

export class BoundsModule
{
	// we extend visible viexport to load elements on this area, so the user see them directly when panning or zoom out
	extendedBounds : L.LatLngBounds;

	// the bounds where elements has already been retrieved
	// we save one filledBound per mainOptionId
	// and one filledBound per level of element representation
	fullRepresentationFilledBound : L.LatLngBounds[] = [];
	compactRepresentationFilledBound : L.LatLngBounds[] = [];

	// indicate if we already retrieved all elements of the max bounds
	fullRepresentationRetrievingComplete : boolean[] = [];
	compactRepresentationRetrievingComplete : boolean[] = [];

	// the bounds including all our map (here France)
	maxBounds : L.LatLngBounds;

	constructor()
	{
		// france
		let corner1 = L.latLng(52, 10);
		let corner2 = L.latLng(40, -5);
		this.maxBounds = L.latLngBounds(corner1, corner2);
	}

	initialize()
	{
		for(let mainOptionId of App.categoryModule.getMainOptionsIdsWithAll())
		{
			this.fullRepresentationFilledBound[mainOptionId] = null;
			this.compactRepresentationFilledBound[mainOptionId] = null;
			this.fullRepresentationRetrievingComplete[mainOptionId] = false;
			this.compactRepresentationRetrievingComplete[mainOptionId] = false;
		}
	}	

	createBoundsFromLocation($location : L.LatLng, $radius = 30)
	{
		let degree = $radius / 110 / 2;
		this.extendedBounds = L.latLngBounds(L.latLng($location.lat - degree, $location.lng - degree), L.latLng($location.lat + degree, $location.lng + degree) );
		//console.log("CREATE BOUNDS from loaction", this.extendedBounds);
		//if (this.extendedBounds) L.rectangle(this.extendedBounds, {color: "blue", weight: 3}).addTo(App.map()); 
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
			// nothing to do
		}
		else 
		{
			// if fillebounds for category 'all' contains the filledbound of other category
			// we set fillebound from other category to filledBound "all"
			this.tryToExtendFilledBoundFromAllCategory(this.fullRepresentationFilledBound);
			this.tryToExtendFilledBoundFromAllCategory(this.compactRepresentationFilledBound);
		}
	}

	private tryToExtendFilledBoundFromAllCategory($filledBound)
	{
		if ($filledBound['all'] &&
				 (!$filledBound[App.currMainId] || $filledBound['all'].contains($filledBound[App.currMainId]) ))
			{
				$filledBound[App.currMainId] = $filledBound['all']
			}
	}

	// Wait from ajax response to update new filledBounds
	updateFilledBoundsWithBoundsReceived(expectedBound : L.LatLngBounds, mainOptionId : number, getFullRepresentation : boolean)
	{
		//console.log("updateFilledBoundsWithBoundsReceived", mainOptionId);
		if(getFullRepresentation) this.fullRepresentationFilledBound[mainOptionId] = expectedBound;
		else this.compactRepresentationFilledBound[mainOptionId] = expectedBound;

		if (expectedBound.contains(this.maxBounds)) 
		{
			if(getFullRepresentation) this.fullRepresentationRetrievingComplete[mainOptionId] = true;
			else this.compactRepresentationRetrievingComplete[mainOptionId] = true;
		}
	}

	private currFilledBound($getFullRepresentation : boolean) : L.LatLngBounds
	{ 
		if ($getFullRepresentation) 
			return this.fullRepresentationFilledBound[App.currMainId];
		else
			return this.compactRepresentationFilledBound[App.currMainId];
	}

	private currRetrievingComplete($getFullRepresentation : boolean) : boolean
	{ 
		if ($getFullRepresentation) 
			return this.fullRepresentationRetrievingComplete[App.currMainId];
		else
			return this.compactRepresentationRetrievingComplete[App.currMainId];
	}

	calculateFreeBounds($getFullRepresentation = false)
	{
		let freeBounds = [];
		let expectedBounds;

		// if we already complete the retrieving (i.e. all element are already received)
		if (this.currRetrievingComplete($getFullRepresentation)) return null;

		let currFilledBound = this.currFilledBound($getFullRepresentation);

		//console.log("calculateFreebounds extendedBounds = ", this.extendedBounds);

		//if (currFilledBound) L.rectangle(currFilledBound, {color: "red", weight: 3}).addTo(App.map()); 
		//if (this.extendedBounds) L.rectangle(this.extendedBounds, {color: "blue", weight: 3}).addTo(App.map()); 

		let freeBound1, freeBound2, freeBound3, freeBound4;

		if (!currFilledBound || !currFilledBound.intersects(this.extendedBounds))
		{
			// first initialization or no intersection
			freeBounds.push(this.extendedBounds);
			expectedBounds = this.extendedBounds;
		}		
		else
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

					expectedBounds = this.extendedBounds;

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

					freeBounds.push(freeBound1);
					if (freeBound2) freeBounds.push(freeBound2);		

					expectedBounds = L.latLngBounds( 
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

		return { "freeBounds" : freeBounds, "expectedFillBounds" : expectedBounds};
	}
}