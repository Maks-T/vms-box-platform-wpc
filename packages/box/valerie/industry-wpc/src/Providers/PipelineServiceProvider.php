<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Providers;

use Illuminate\Support\ServiceProvider;
use Nicole\Box\Core\Support\Pipelines\PipelineRoleResolver;
use Valerie\Box\IndustryWpc\Support\Constants\WpcPipelineRole;

class PipelineServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        if (class_exists(PipelineRoleResolver::class)) {
            PipelineRoleResolver::register(WpcPipelineRole::class);
        }
    }
}
