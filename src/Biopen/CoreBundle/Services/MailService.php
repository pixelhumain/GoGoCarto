<?php
namespace Biopen\CoreBundle\Services;

use Doctrine\ODM\MongoDB\DocumentManager;
use Biopen\GeoDirectoryBundle\Document\UserInteractionReport;
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

    public function sendMail($to, $subject, $content, $from = null, $toBCC = null)
    {
        // TODO config an admin email for automated message
        if (!$from) $from = array('nepasrepondre@presdecheznous.fr' => 'Près de chez Nous');
        try {

            $draftedContent = $this->draftTemplate($content);

            $message = (new \Swift_Message())
            ->setFrom($from)       
            ->setSubject($subject)
            ->setBody(
                $draftedContent,
                'text/html'
            );

            if ($to) $message->setTo($to);
            if ($toBCC) $message->setBcc($toBCC);
        
            $this->mailer->send($message);
        }
        catch (\Swift_RfcComplianceException $e) {
            $error = 'Une erreur est survenue : ' . $e->getMessage();
            return [ 'success' => false, 'message' => $error ];
        }
        
        return [ 'success' => true, 'message' => 'The message has been send' ];
    }

    public function sendAutomatedMail($mailType, $element, $customMessage = null, $option = null)
    {
        if (!$customMessage) $customMessage = 'Pas de message particulier';
        $mailConfig = $this->getAutomatedMailConfigFromType($mailType);

        if (!$mailConfig->getActive())
            return [ 'success' => false, 'message' => $mailType . ' automated mail disabled' ];
        
        $draftResponse = $this->draftEmail($mailType,$element,$customMessage, $option);
        
        if ($draftResponse['success'])
        {
            if (in_array($mailType, ['validation', 'refusal'])) 
                $mailTo = $element->getCurrContribution() ? $element->getCurrContribution()->getUserEmail() : null;
            else if ($mailType == 'report' && $option && $option instanceof UserInteractionReport)
                $mailTo = $option->getUserEmail();
            else 
                $mailTo =  $element->getEmail();

            if ($mailTo && $mailTo != "no email")
            {
                return $this->sendMail($mailTo, $draftResponse['subject'], $draftResponse['content']);
            }
            else
                return [ 'success' => false, 'message' => 'No email address to deliver to' ];            
        }
        else 
        {
            return $draftResponse;
        }        
    }

    public function draftEmail($mailType, $element, $customMessage, $option)
    {
        $mailConfig = $this->getAutomatedMailConfigFromType($mailType);

        if ($mailConfig == null)
            return [ 'success' => false, 'message' => $mailType . ' automated mail does not exist' ];        
        if (!$mailConfig->getSubject() || !$mailConfig->getContent()) 
            return [ 'success' => false, 'message' => $mailType . ' automated mail missing subject or content' ];

        $subject = $this->replaceMailsVariables($mailConfig->getSubject(), $element, $customMessage, $mailType, $option);
        $content = $this->replaceMailsVariables($mailConfig->getContent(), $element, $customMessage, $mailType, $option);

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
            case 'report':         $mailConfig = $this->config->getReportResolvedMail();break;
        }

        return $mailConfig;
    }

    private function replaceMailsVariables($string, $element = null, $customMessage, $mailType, $option)
    {
        if ($element !== null && $element)
        {
            $showElementUrl = $this->router->generate('biopen_directory_showElement', array('name' => $element->getName(), 'id' => $element->getId()),UrlGeneratorInterface::ABSOLUTE_URL);
            $showElementUrl = str_replace('%23', '#', $showElementUrl);
            $editElementUrl = $this->router->generate('biopen_element_edit', array('id' => $element->getId()), UrlGeneratorInterface::ABSOLUTE_URL);
            $elementName = $element->getName();
            $contribution = $element->getCurrContribution(); 
            
            if ($mailType == 'report' && $option && $option instanceof UserInteractionReport)
                $user = $option->getUserDisplayName();
            else
                $user = $contribution ? $contribution->getUserDisplayName() : 'Inconnu';

            $string = preg_replace('/({{((?:\s)+)?element((?:\s)+)?}})/i', $elementName, $string);
            $string = preg_replace('/({{((?:\s)+)?user((?:\s)+)?}})/i',    $user, $string);
            $string = preg_replace('/({{((?:\s)+)?customMessage((?:\s)+)?}})/i', $customMessage, $string);
            $string = preg_replace('/({{((?:\s)+)?showUrl((?:\s)+)?}})/i', $showElementUrl, $string);
            $string = preg_replace('/({{((?:\s)+)?editUrl((?:\s)+)?}})/i', $editElementUrl, $string);

            $string = str_replace('http://http://', 'http://', $string);
            $string = str_replace('http://', 'https://', $string);
        }

        $homeUrl = $this->router->generate('biopen_homepage', array(), UrlGeneratorInterface::ABSOLUTE_URL);
        $string = preg_replace('/({{((?:\s)+)?homeUrl((?:\s)+)?}})/i', $homeUrl, $string);
        $string = preg_replace('/({{((?:\s)+)?customMessage((?:\s)+)?}})/i', $customMessage, $string);

        return $string;
    }
}