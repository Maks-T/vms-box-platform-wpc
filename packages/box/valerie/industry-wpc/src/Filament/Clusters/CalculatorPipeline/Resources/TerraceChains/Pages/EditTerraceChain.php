<?php

namespace Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Resources\TerraceChains\Pages;

use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Resources\TerraceChains\TerraceChainResource;

class EditTerraceChain extends EditRecord
{
    protected static string $resource = TerraceChainResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
