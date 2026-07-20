<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Shared\Pages;

use Filament\Actions\Action;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Schema;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Pages\BuilderPipelinePage;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Shared\Schemas\PipelineChainForm;

use Illuminate\Database\Eloquent\Model;

abstract class ManagePipelineChains extends ListRecords
{
  /**
   * Возвращает код пайплайна для редиректа ('terrace' или 'fence')
   */
  abstract protected function getPipelineType(): string;

  /**
   * Возвращает системный код типа продукта для фильтрации ('terraceBoard' или 'pillar')
   */
  abstract protected function getTypeCode(): string;

  /**
   * Возвращает переводимое название корневого элемента
   */
  abstract protected function getRootLabel(): string;

  /**
   * Конфигурация общих экшнов заголовка (вынесено из дочерних страниц)
   */
  protected function getHeaderActions(): array
  {
    return [
      Action::make('create_configuration')
        ->label(__('Create Configuration'))
        ->modalHeading(__('Select Root SKU to Configure'))

        ->schema(fn(Schema $schema) => PipelineChainForm::configure($schema, $this->getTypeCode(), $this->getRootLabel()))
        ->action(function (array $data) {
          return redirect(BuilderPipelinePage::getUrl([
            'base_variant_id' => $data['variant_id'],
            'type' => $this->getPipelineType()
          ]));
        }),
    ];
  }
}
