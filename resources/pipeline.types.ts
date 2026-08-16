/**
 * Базовая обертка стандартного ответа API Nicole Core
 */
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

/**
 * Объект сущности (SKU, товар, умный справочник)
 */
export interface EntityReference {
  /** Тип сущности в БД: 'product_variant' | 'complex_dictionary_record' | 'product' */ // ToDo будут в будущем другие типы
  type: string;
  /** Уникальный ID сущности (ID варианта / SKU или ID записи) */
  id: number;
  /** ID базового родителя (ID базового товара / ID справочника) */
  parent_id?: number | null;
  /** Артикул (при наличии) */
  sku?: string | null;
  /** Название позиции */
  name?: string;
  /** ЧПУ-слаг родительского товара */
  product_slug?: string | null;
  /** Ссылка на фото */
  preview_picture?: string | null;
  /** Скалярные параметры слота (например, { holes: "1", noseSize: "20" }) */
  params?: Record<string, string | number | boolean>;

  /** Вложенные дочерние связи (например, крепление у универсальной доски) */
  [key: string]: any;
}

/**
 * Описание слота зависимости в схеме пайплайна
 */
export interface PipelineSlot {
  label_key: string;
  /** 'product_type' (товары каталога) | 'complex_dictionary' (справочник) | 'scalar' (числовое поле) */
  target_type: 'product_type' | 'complex_dictionary' | 'scalar' | string; // ToDo будут в будущем другие типы
  /** Код типа товара или справочника (null для скалярных параметров) */
  target_code: string | null;
  is_required: boolean;
  is_multiple: boolean;
}

/**
 * Схема ролей и слотов пайплайна (parent_type_code -> role_code -> PipelineSlot)
 */
export type PipelineSchema = Record<string, Record<string, PipelineSlot>>;

/**
 * Метаданные пайплайна
 */
export interface Pipeline {
  id: number;
  code: string;
  slug: string | null;
  name: string;
  description: string | null;
  schema: PipelineSchema;
}

/**
 * Узел дерева связей
 */
export interface PipelineTreeNode {
  type: string;
  id: number;
  parent_id: number | null;
  name: string;
  slug: string | null;
  image_url: string | null;
  is_valid: boolean;
  fields: PipelineField[];
  pipeline_industry?: string | null;
}

/**
 * Слот/поле внутри дерева связей
 */
export interface PipelineField {
  rule_id: number | null;
  field_code: string;
  label: string;
  is_required: boolean;
  is_filled: boolean;
  is_valid: boolean;
  /** Заполнено, если это скалярный параметр (число/строка) */
  value: string | number | boolean | null;
  /** Заполнено, если это связанная сущность каталога/справочника */
  child: EntityReference | null;
  static_meta: Record<string, any> | null;
  children: Array<PipelineTreeNode | PipelineField>;
  is_multiple?: boolean;
  type?: string;
}

/**
 * Компактная карта связей калькулятора (bindings)
 */
export type PipelineBindings = Record<
  string,
  EntityReference | EntityReference[] | { params: Record<string, any> } | any
>;

/** ----------------------
// Ответы эндпоинтов API:
------------------------ */

/**
 * GET /api/v1/pipelines
 * Список всех доступных пайплайнов
 */
export type PipelineListResponse = ApiResponse<Pipeline[]>;

/**
 * GET /api/v1/pipelines/{pipeline_code}
 * Схема пайплайна и список стартовых корневых сущностей
 */
export type PipelineRootEntitiesResponse = ApiResponse<{
  pipeline: Pipeline;
  root_entities: EntityReference[];
}>;

/**
 * GET /api/v1/pipelines/{pipeline_code}/{base_entity_id}
 * Схема, компактная карта связей (bindings) и полное дерево (tree)
 */
export type PipelineConfigShowResponse = ApiResponse<{
  pipeline: Pipeline;
  bindings: PipelineBindings;
  tree: PipelineTreeNode;
}>;
