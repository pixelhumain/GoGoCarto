<?php
namespace Biopen\CoreBundle\Services;

use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
 
class MailService 
{
    protected $em;
    protected $config;
    protected $mailer;
    protected $router;
    protected $twig;

	/**
	* Constructor
	*/
	public function __construct(DocumentManager $documentManager, $mailer, $router, $twig)
	{
	   $this->em = $documentManager;
       $this->config = $this->em->getRepository('BiopenCoreBundle:Configuration')->findConfiguration();
       $this->mailer = $mailer;
       $this->router = $router;
       $this->twig = $twig;
	}

    public function sendMail($to, $subject, $content, $from = null)
    {
        // TODO config an admin email for automated message
        if (!$from) $from = 'nepasrepondre@presdecheznous.fr';

        $message = (new \Swift_Message())
        ->setFrom($from)
        ->setTo($to)
        ->setSubject($subject)
        ->setBody(
            $this->draftTemplate($content),
            'text/html'
        );

        try {
            $this->mailer->send($message);
        }
        catch (\Swift_RfcComplianceException $e) {
            $this->addFlash('sonata_flash_error', 'Une erreur est survenue : ' . $e->getMessage());
        }
        
    }

    public function sendAutomatedMail($mailType, $element, $customMessage = 'Pas de message particulier')
    {
        if (!$element || !$element->getMail()) 
            return [ 'success' => false, 'message' => 'Element don\'t have a mail' ];
        
        $draftResponse = $this->draftEmail($mailType,$element,$customMessage);
        
        if ($draftResponse['success'])
        {
            $this->sendMail($element->getMail(), $draftResponse['subject'], $draftResponse['content']);
            return [ 'success' => true, 'message' => 'The message has been send' ];
        }
        else 
        {
            return $draftResponse;
        }        
    }

    public function draftEmail($mailType, $element, $customMessage)
    {
        $mailConfig = $this->getAutomatedMailConfigFromType($mailType);

        if ($mailConfig == null)
            return [ 'success' => false, 'message' => $mailType . ' automated mail does not exist' ];
        if (!$mailConfig->getActive()) 
            return [ 'success' => false, 'message' => $mailType . ' automated mail disabled' ];
        if (!$mailConfig->getSubject() || !$mailConfig->getContent()) 
            return [ 'success' => false, 'message' => $mailType . ' automated mail missing subject or content' ];

        $subject = $this->replaceMailsVariables($mailConfig->getSubject(), $element, $customMessage);
        $content = $this->replaceMailsVariables($mailConfig->getContent(), $element, $customMessage);

        return [ 'success' => true, 'subject' => $subject, 'content' => $content];
    }

    public function draftTemplate($content, $template = 'base')
    {
        return $this->twig->render(
                '@BiopenCoreBundle/emails/layout.html.twig',
                array('content' => $content, 'config' => $this->config)
            );
    }

    public function getConfig()
    {
        return $this->config;
    }

    public function getAutomatedMailConfigFromType($mailType)
    {
        $mailConfig = null;

        switch($mailType)
        {
            case 'add':            $mailConfig = $this->config->getAddMail();break;
            case 'edit':           $mailConfig = $this->config->getEditMail();break;
            case 'delete':         $mailConfig = $this->config->getDeleteMail();break;
            case 'validation':     $mailConfig = $this->config->getValidationMail();break;
            case 'refusal':        $mailConfig = $this->config->getRefusalMail();break;
        }

        return $mailConfig;
    }

    private function replaceMailsVariables($string, $element = null, $customMessage = '')
    {
        if ($element !== null)
        {
            $showElementUrl = $this->router->generate('biopen_directory_showElement', array('name' => $element->getName(), 'id' => $element->getId()),UrlGeneratorInterface::ABSOLUTE_URL);
            $showElementUrl = str_replace('%23', '#', $showElementUrl);
            $editElementUrl = $this->router->generate('biopen_element_edit', array('id' => $element->getId()), UrlGeneratorInterface::ABSOLUTE_URL);
            $elementName = $element->getName();

            $string = preg_replace('/({{((?:\s)+)?name((?:\s)+)?}})/i', $elementName, $string);
            $string = preg_replace('/({{((?:\s)+)?customMessage((?:\s)+)?}})/i', $customMessage, $string);
            $string = preg_replace('/({{((?:\s)+)?showUrl((?:\s)+)?}})/i', $showElementUrl, $string);
            $string = preg_replace('/({{((?:\s)+)?editUrl((?:\s)+)?}})/i', $editElementUrl, $string);

            $string = str_replace('http://http://', 'http://', $string);
            $string = str_replace('http://', 'https://', $string);
        }

        $string = preg_replace('/({{((?:\s)+)?customMessage((?:\s)+)?}})/i', $customMessage, $string);

        return $string;
    }
}