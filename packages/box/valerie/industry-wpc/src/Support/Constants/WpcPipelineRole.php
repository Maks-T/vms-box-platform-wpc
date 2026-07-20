<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Support\Constants;

use Nicole\Box\Core\Support\Contracts\ChoiceConstantInterface;

class WpcPipelineRole implements ChoiceConstantInterface
{
  // Роли для Террасы
  public const string START_CLIP = 'startClip';
  public const string BASE_CLIP = 'baseClip';
  public const string CORNER = 'corner';
  public const string UNIVERSAL_BOARDS = 'universalBoards';
  public const string STEP_BOARDS = 'stepBoards';
  public const string FIXING = 'fixing';
  public const string NOSE_SIZE = 'noseSize';

  // Роли для Ограждений
  public const string BALUSTER = 'baluster';
  public const string FENCE_PROFILE = 'fenceProfile';
  public const string ACCESSORIES = 'accessories';
  public const string BRACKET = 'bracket';
  public const string BRACKET_FASTENER = 'bracketFastener';
  public const string RAIL = 'rail';
  public const string LATH = 'lath';
  public const string LATH_FASTENER = 'lathFastener';

  public const string HOLES = 'holes';

  public static function label(string $value): string
  {
    return match ($value) {
      self::START_CLIP => __('Start Clip'),
      self::BASE_CLIP => __('Base Clip'),
      self::CORNER => __('Decorative Corner'),
      self::UNIVERSAL_BOARDS => __('Universal Boards'),
      self::STEP_BOARDS => __('Step Boards'),
      self::FIXING => __('Board/Lath Screw'),
      self::NOSE_SIZE => __('Nose Size'),
      self::BALUSTER => __('Baluster'),
      self::FENCE_PROFILE => __('Fence Profile'),
      self::ACCESSORIES => __('Pillar Accessories'),
      self::BRACKET => __('Pillar/Rail Bracket'),
      self::BRACKET_FASTENER => __('Bracket Screw'),
      self::RAIL => __('Railing'),
      self::LATH => __('Lath'),
      self::LATH_FASTENER => __('Lath Screw'),
      self::HOLES => __('Holes'), // Добавлен перевод
      default => '',
    };
  }

  public static function defaultProductType(string $value): ?string
  {
    return match ($value) {
      self::START_CLIP, self::BASE_CLIP, self::BRACKET => 'brackets',
      self::CORNER => 'decorProducts',
      self::UNIVERSAL_BOARDS => 'board',
      self::STEP_BOARDS => 'stepBoard',
      self::FIXING, self::BRACKET_FASTENER, self::LATH_FASTENER => 'fasteners',
      self::NOSE_SIZE, self::HOLES => 'general',
      self::BALUSTER => 'baluster',
      self::FENCE_PROFILE => 'fenceProfile',
      self::ACCESSORIES => 'accessories',
      self::RAIL => 'rail',
      self::LATH => 'lath',
      default => null,
    };
  }

  public static function options(): array
  {
    $options = [];
    foreach (self::cases() as $case) {
      $options[$case] = self::label($case) . " ({$case})";
    }
    return $options;
  }

  public static function cases(): array
  {
    return [
      self::START_CLIP,
      self::BASE_CLIP,
      self::CORNER,
      self::UNIVERSAL_BOARDS,
      self::STEP_BOARDS,
      self::FIXING,
      self::NOSE_SIZE,
      self::BALUSTER,
      self::FENCE_PROFILE,
      self::ACCESSORIES,
      self::BRACKET,
      self::BRACKET_FASTENER,
      self::RAIL,
      self::LATH,
      self::LATH_FASTENER,
      self::HOLES,
    ];
  }
}
