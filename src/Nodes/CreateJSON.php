<?php

namespace DataStory\Nodes;

use DataStory\Categories\Workflow;
use DataStory\NodeModel;
use DataStory\Parameters\JSON_;
use DataStory\Parameters\Number;
use DataStory\Parameters\String_;

class CreateJSON extends NodeModel
{
    const SHORT_DESCRIPTION  = 'Create a sequence of objects from a JSON array';

    const CATEGORY = Workflow::class;

    const IN_PORTS = [];    

    public static function parameters($data = [])
    {
        return [
            String_::make('node_name')->default('CreateJSON'),
            JSON_::make('json')->default(static::defaultJson()),
        ];
    }

    public function run()
    {
        $this->output(
            collect(
                json_decode($this->getParameter('json'))
            )
        );
    }

    protected static function defaultJson()
    {
        return json_encode([
            [
                'feature_id' => '1'
            ],
            [
                'feature_id' => '2'
            ],
            [
                'feature_id' => '3'
            ],                        
        ], JSON_PRETTY_PRINT);
    }
}