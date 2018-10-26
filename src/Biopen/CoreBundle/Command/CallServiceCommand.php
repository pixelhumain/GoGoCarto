<?php

namespace Biopen\CoreBundle\Command;

use Biopen\SaasBundle\Command\GoGoAbstractCommand;
use Symfony\Component\Console\Exception\InvalidArgumentException;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Class CallServiceCommand
 * @package Krlove\AsyncServiceCallBundle\Command
 */
class CallServiceCommand extends GoGoAbstractCommand
{
    /**
     * @inheritdoc
     */
    protected function gogoConfigure()
    {
        $this
            ->setName('krlove:service:call')
            ->setDescription('Calls a service method with arguments')
            ->addArgument('service', InputArgument::REQUIRED, 'Service ID')
            ->addArgument('method', InputArgument::REQUIRED, 'Method to call on the service')
            ->addOption('args', null, InputOption::VALUE_OPTIONAL, 'Arguments to supply to the method');
    }

    /**
     * @inheritdoc
     */
    protected function gogoExecute($em, InputInterface $input, OutputInterface $output)
    {
        $logger = $this->getContainer()->get('logger');

        try {
            $serviceId = $input->getArgument('service');
            $service = $this->getContainer()->get($serviceId);
            $logger->error("execute command");
            $method = $input->getArgument('method');
            if (!method_exists($service, $method)) {
                throw new InvalidArgumentException(
                    sprintf('Method %s doesn\'t exist on class %s', $method, get_class($service))
                );
            }

            $serviceArgs = unserialize(base64_decode($input->getOption('args')));

            if ($serviceArgs) {
                call_user_func_array([$service, $method], $serviceArgs);
            } else {
                call_user_func([$service, $method]);
            }
        } catch (\Exception $e) {
            $logger->error($e->getMessage());
        }
    }
}