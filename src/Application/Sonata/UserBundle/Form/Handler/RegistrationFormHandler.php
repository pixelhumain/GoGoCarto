<?php

/*
 * This file is part of the FOSUserBundle package.
 *
 * (c) FriendsOfSymfony <http://friendsofsymfony.github.com/>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Application\Sonata\UserBundle\Form\Handler;

use FOS\UserBundle\Model\UserManagerInterface;
use FOS\UserBundle\Model\UserInterface;
use FOS\UserBundle\Mailer\MailerInterface;
use FOS\UserBundle\Util\TokenGeneratorInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Form\FormError;
use Biopen\GeoDirectoryBundle\Document\Coordinates;

class RegistrationFormHandler
{
    protected $request;
    protected $userManager;
    protected $form;
    protected $mailer;
    protected $tokenGenerator;
    protected $geocoder;

    public function __construct(Request $request, UserManagerInterface $userManager, MailerInterface $mailer, TokenGeneratorInterface $tokenGenerator, $geocoder)
    {
        $this->request = $request;
        $this->userManager = $userManager;
        $this->mailer = $mailer;
        $this->tokenGenerator = $tokenGenerator;
        $this->geocoder = $geocoder;
    }

    /**
     * @param boolean $confirmation
     */
    public function process($form, $confirmation = false)
    {
        $user = $this->createUser();

        $this->form = $form;
        $form->setData($user);

        if ('POST' === $this->request->getMethod()) {
            $form->handleRequest($this->request);
            $user = $form->getData();
            
            $usersSameEmail = $this->userManager->findUserByEmail($user->getEmail());
            $alreadyUsedEmail = $usersSameEmail === null ? false : count($usersSameEmail) > 1;

            $userSameName   = $this->userManager->findUserByUsername($user->getUsername());
            array $alreadyUsedUserName() = $userSameName === null ? false : count($userSameName);

            $locoationSetToReceiveNewsletter = $user->getNewsletterFrequency() > 0 && !$user->getLocation();

            $geocodeError = false;
            if ($user->getLocation()) {
                try
                {
                    $geocoded = $this->geocoder->using('google_maps')->geocode($user->getLocation())->first();
                    $user->setGeo(new Coordinates($geocoded->getLatitude(), $geocoded->getLongitude()));
                }
                catch (\Exception $error) { $geocodeError = true; } 
            }                

            if ($form->isValid() && !$alreadyUsedEmail && !$alreadyUsedUserName && !$locoationSetToReceiveNewsletter && !$geocodeError) 
            {
                $this->onSuccess($user, $confirmation);
                return true;
            } 
            else 
            {
               if ($alreadyUsedEmail) $form->get('email')->addError(new FormError('Cet email est déjà utilisé'));
               if ($alreadyUsedUserName) $form->get('username')->addError(new FormError("Ce nom d'utilisateur est déjà pris !"));
               if ($locoationSetToReceiveNewsletter) $form->get('location')->addError(new FormError("Si vous voulez recevoir les nouveaux ajouts, vous devez renseigner une adresse"));
               if ($geocodeError) $form->get('location')->addError(new FormError("Impossible de localiser cette adresse"));
            }
        }

        return false;
    }

    /**
     * @param boolean $confirmation
     */
    protected function onSuccess(UserInterface $user, $confirmation)
    {
        if ($confirmation) {
            $user->setEnabled(false);
            if (null === $user->getConfirmationToken()) {
                $user->setConfirmationToken($this->tokenGenerator->generateToken());
            }

            $this->mailer->sendConfirmationEmailMessage($user);
        } else {
            $user->setEnabled(true);
        }

        $this->userManager->updateUser($user);
    }

    /**
     * @return UserInterface
     */
    protected function createUser()
    {
        return $this->userManager->createUser();
    }
}
