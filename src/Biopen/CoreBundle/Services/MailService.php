<?php
namespace Biopen\CoreBundle\Services;

use Doctrine\ODM\MongoDB\DocumentManager;
 
class MailService 
{
    protected $em;
    protected $config;
    protected $mailer;

	/**
	* Constructor
	*/
	public function __construct(DocumentManager $documentManager, $mailer)
	{
	   $this->em = $documentManager;
       $this->config = $this->em->getRepository('BiopenCoreBundle:Configuration')->findConfiguration();
       $this->mailer = $mailer;
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
            $content,
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
        
        $mailConfig = $this->getAutomatedMailConfigFromType($mailType);

        if (!$mailConfig->getActive()) 
            return [ 'success' => false, 'message' => $mailType . ' automated mail disabled' ];
        if (!$mailConfig->getSubject() || !$mailConfig->getContent()) 
            return [ 'success' => false, 'message' => $mailType . ' automated mail missing subject or content' ];

        $subject = $this->replaceMailsVariables($mailConfig->getSubject(), $element, $customMessage);
        $content = $this->replaceMailsVariables($mailConfig->getContent(), $element, $customMessage);

        
        $this->sendMail($element->getMail(), $subject, $content);

        return [ 'success' => true, 'message' => 'The message has been send' ];
    }

    public function getConfig()
    {
        return $this->config;
    }

    public function getAutomatedMailConfigFromType($mailType)
    {
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

    private function replaceMailsVariables($string, $element, $customMessage)
    {
        $string = preg_replace('({{((?:\s)+)?name((?:\s)+)?}})', $element->getName(), $string);
        $string = preg_replace('({{((?:\s)+)?message((?:\s)+)?}})', $customMessage, $string);
        return $string;
    }
}