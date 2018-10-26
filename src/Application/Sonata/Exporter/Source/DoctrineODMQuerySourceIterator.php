<?php

/*
 * This file is part of the Sonata Project package.
 *
 * (c) Thomas Rabaix <thomas.rabaix@sonata-project.org>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*
    this source iterator has been modified to fit the gogocarto needs : for the custom form, we are using a hash wich was not recognize
    in the source iterator. I've been modified the getValue method so I can use a hash, using the label as a key. See ElementAdmin.php
    to see ho it is used
*/
namespace Application\Sonata\Exporter\Source;

use Doctrine\ODM\MongoDB\Query\Query;
use Doctrine\ORM\Internal\Hydration\IterableResult;
use Exporter\Exception\InvalidMethodCallException;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Symfony\Component\PropertyAccess\PropertyPath;
use Exporter\Source\SourceIteratorInterface;

class DoctrineODMQuerySourceIterator implements SourceIteratorInterface
{
    /**
     * @var Query
     */
    protected $query;

    /**
     * @var IterableResult
     */
    protected $iterator;

    /**
     * @var array
     */
    protected $propertyPaths;

    /**
     * @var PropertyAccess
     */
    protected $propertyAccessor;

    /**
     * @var string default DateTime format
     */
    protected $dateTimeFormat;

    /**
     * @param Query  $query          The Doctrine Query
     * @param array  $fields         Fields to export
     * @param string $dateTimeFormat
     */
    public function __construct(Query $query, array $fields, $dateTimeFormat = 'r')
    {
        $this->query = clone $query;

        $this->propertyAccessor = PropertyAccess::createPropertyAccessor();

        $this->propertyPaths = [];
        foreach ($fields as $name => $field) {
            if (is_string($name) && is_string($field)) {
                $this->propertyPaths[$name] = new PropertyPath($field);
            } else {
                $this->propertyPaths[$field] = new PropertyPath($field);
            }
        }

        $this->dateTimeFormat = $dateTimeFormat;
    }

    /**
     * {@inheritdoc}
     */
    public function current()
    {
        $current = $this->iterator->current();

        $data = [];

        foreach ($this->propertyPaths as $name => $propertyPath) {
            $data[$name] = $this->getValue($this->propertyAccessor->getValue($current, $propertyPath), $name);
        }

        $this->query->getDocumentManager()->getUnitOfWork()->detach($current);

        return $data;
    }

    /**
     * {@inheritdoc}
     */
    public function next()
    {
        $this->iterator->next();
    }

    /**
     * {@inheritdoc}
     */
    public function key()
    {
        return $this->iterator->key();
    }

    /**
     * {@inheritdoc}
     */
    public function valid()
    {
        return $this->iterator->valid();
    }

    /**
     * {@inheritdoc}
     */
    public function rewind()
    {
        if ($this->iterator) {
            throw new InvalidMethodCallException('Cannot rewind a Doctrine\ODM\Query');
        }

        $this->iterator = $this->query->iterate();
        $this->iterator->rewind();
    }

    /**
     * @param string $dateTimeFormat
     */
    public function setDateTimeFormat($dateTimeFormat)
    {
        $this->dateTimeFormat = $dateTimeFormat;
    }

    /**
     * @return string
     */
    public function getDateTimeFormat()
    {
        return $this->dateTimeFormat;
    }

    /**
     * @param $value
     *
     * @return null|string
     */
    protected function getValue($value, $name)
    {        
        if (is_array($value)) {
            $value = array_key_exists($name, $value) ? $value[$name] : null;
        } elseif ($value instanceof \Traversable) {
            $value = null;
        } elseif ($value instanceof \DateTimeInterface) {
            $value = $value->format($this->dateTimeFormat);
        } elseif (is_object($value)) {
            $value = (string) $value;
        }

        return $value;
    }
}
