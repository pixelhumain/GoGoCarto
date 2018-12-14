<?php
namespace Biopen\GeoDirectoryBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Output\OutputInterface;

use Biopen\GeoDirectoryBundle\Document\ElementStatus;

use Biopen\SaasBundle\Command\GoGoAbstractCommand;

class UpdateElementsJsonCommand extends GoGoAbstractCommand
{
    protected function gogoConfigure()
    {
       $this
        ->setName('app:elements:updateJson')
        ->setDescription('Calculate again all the element json representation');
    }

    protected function gogoExecute($em, InputInterface $input, OutputInterface $output)
    {
      try {
        $elements = $em->getRepository('BiopenGeoDirectoryBundle:Element')->findVisibles(); 
        $count = $elements->count();

        $this->log('Generating json representation for ' . $count . ' elements...');

        $i = 0;
        foreach ($elements as $key => $element) 
        {
           $element->updateJsonRepresentation();

            if ((++$i % 50) == 0) {
                $em->flush();
                $em->clear();
            }
            if (($i % 1000) == 0) {
                $this->log($i . ' / ' . $count . ' elements completed...');
            }
        }

        $em->flush();
        $em->clear(); 

        $this->log('All elements successfully updated');

      } catch (\Exception $e) {
          $this->error($e->getMessage());
      }
    }
      
}