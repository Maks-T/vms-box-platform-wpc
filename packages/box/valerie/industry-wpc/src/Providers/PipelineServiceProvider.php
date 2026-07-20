<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Providers;

use Illuminate\Support\ServiceProvider;
use Nicole\Box\Core\Services\Calculator\PipelineTreeService;
use Nicole\Box\Core\Support\Calculator\PipelineRoleResolver;
use Valerie\Box\IndustryWpc\Support\Constants\WpcPipelineRole;

class PipelineServiceProvider extends ServiceProvider
{
  public function boot(): void
  {
    /** Отключаем статическую регистрацию схемы пайплайна */
    /* if (class_exists(PipelineTreeService::class)) {
       $this->registerWpcSchemas();
     }*/

    // Регистрация констант ролей дпк в реестре ядра
    if (class_exists(PipelineRoleResolver::class)) {
      PipelineRoleResolver::register('wpc', WpcPipelineRole::class);
    }

  }

  /**
   * Регистрация отраслевых схем ДПК в реестре ядра.
   */
  protected function registerWpcSchemas(): void
  {
    // Схема Террасы
    PipelineTreeService::registerSchema('pl_terrace', [
      'terraceBoard' => [
        'startClip' => [
          'label_key' => 'Start Clip',
          'type_code' => 'brackets',
          'is_required' => true,
        ],
        'baseClip' => [
          'label_key' => 'Base Clip',
          'type_code' => 'brackets',
          'is_required' => true,
        ],
        'corner' => [
          'label_key' => 'Corner',
          'type_code' => 'decorProducts',
          'is_required' => false,
        ],
        'universalBoards' => [
          'label_key' => 'Universal Boards',
          'type_code' => 'board',
          'is_required' => false,
          'is_multiple' => true,
        ],
        'stepBoards' => [
          'label_key' => 'Step Boards',
          'type_code' => 'stepBoard',
          'is_required' => false,
          'is_multiple' => true,
        ],
      ],
      'board' => [
        'fixing' => [
          'label_key' => 'Board Screw',
          'type_code' => 'fasteners',
          'is_required' => true,
        ],
      ],
      'stepBoard' => [
        'noseSize' => [
          'label_key' => 'Nose Size',
          'type_code' => 'general',
          'is_required' => true,
        ],
      ],
    ]);

    // Схема Ограждений
    PipelineTreeService::registerSchema('pl_fence', [
      'pillar' => [
        'baluster' => [
          'label_key' => 'Baluster',
          'type_code' => 'baluster',
          'is_required' => true,
        ],
        'fenceProfile' => [
          'label_key' => 'Fence Profile',
          'type_code' => 'fenceProfile',
          'is_required' => false,
        ],
        'accessories' => [
          'label_key' => 'Pillar Accessories',
          'type_code' => 'accessories',
          'is_required' => false,
          'is_multiple' => true,
        ],
        'bracket' => [
          'label_key' => 'Pillar Bracket',
          'type_code' => 'brackets',
          'is_required' => true,
        ],
        'bracketFastener' => [
          'label_key' => 'Pillar Screw',
          'type_code' => 'fasteners',
          'is_required' => true,
        ],
      ],
      'baluster' => [
        'bracket' => [
          'label_key' => 'Baluster Bracket',
          'type_code' => 'brackets',
          'is_required' => true,
        ],
        'bracketFastener' => [
          'label_key' => 'Baluster Screw',
          'type_code' => 'fasteners',
          'is_required' => true,
        ],
        'rail' => [
          'label_key' => 'Railing',
          'type_code' => 'rail',
          'is_required' => true,
        ],
      ],
      'rail' => [
        'bracket' => [
          'label_key' => 'Rail Bracket',
          'type_code' => 'brackets',
          'is_required' => true,
        ],
        'bracketFastener' => [
          'label_key' => 'Rail Screw',
          'type_code' => 'fasteners',
          'is_required' => true,
        ],
      ],
      'fenceProfile' => [
        'lath' => [
          'label_key' => 'Lath',
          'type_code' => 'lath',
          'is_required' => false,
        ],
        'lathFastener' => [
          'label_key' => 'Lath Screw',
          'type_code' => 'fasteners',
          'is_required' => false,
        ],
        'bracket' => [
          'label_key' => 'Profile Bracket',
          'type_code' => 'brackets',
          'is_required' => true,
        ],
        'bracketFastener' => [
          'label_key' => 'Profile Screw',
          'type_code' => 'fasteners',
          'is_required' => true,
        ],
      ],
      'lath' => [
        'lathFastener' => [
          'label_key' => 'Lath Screw',
          'type_code' => 'fasteners',
          'is_required' => true,
        ],
      ],
    ]);
  }
}
