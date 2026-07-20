<?php

namespace Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Resources\FenceChains\Pages;

use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Resources\FenceChains\FenceChainResource;

class EditFenceChain extends EditRecord
{
    protected static string $resource = FenceChainResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
