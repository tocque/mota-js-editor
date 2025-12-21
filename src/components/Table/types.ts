/**
 * Table Component Types
 * 
 * TypeScript type definitions for the Table component system.
 * Based on the original editor_table.ts implementation.
 */

/** Field type enumeration - defines the type of input control to render */
export type FieldType =
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'checkboxSet'
  | 'popCheckboxSet'
  | 'event'
  | 'material'
  | 'color'
  | 'point'
  | 'disable';

/** Field arguments passed to dynamic configuration functions */
export interface FieldArgs {
  /** Field path, e.g., "['main']['floorIds']" */
  field: string;
  /** Comment field path, e.g., "['_data']['main']['_data']['floorIds']" */
  cfield: string;
  /** Value object at this field */
  vobj: unknown;
  /** Configuration object for this field */
  cobj: FieldConfig;
}

/** Select input configuration */
export interface SelectConfig {
  /** Available options for the select dropdown */
  values: unknown[];
}

/** Checkbox set configuration */
export interface CheckboxSetConfig {
  /** Keys for each checkbox option */
  key: (string | number)[];
  /** Prefix labels for each checkbox option */
  prefix: string[];
}

/** Field configuration interface - defines how a field should be rendered and validated */
export interface FieldConfig {
  /** Whether this is a leaf node (renders as editable row) */
  _leaf?: boolean | ((args: FieldArgs) => boolean);
  /** Field type determining the input control */
  _type?: FieldType;
  /** Full comment/description text */
  _data?: string;
  /** Short documentation shown as button tooltip */
  _docs?: string;
  /** Whether to hide this field */
  _hide?: boolean | ((args: FieldArgs) => boolean);
  /** Validation expression using 'thiseval' as the value variable */
  _range?: string;
  /** Whether the value is a string type */
  _string?: boolean | ((args: FieldArgs) => boolean);
  /** Select dropdown configuration */
  _select?: SelectConfig;
  /** Checkbox set configuration */
  _checkboxSet?: CheckboxSetConfig | (() => CheckboxSetConfig);
  /** Event type for event editor */
  _event?: string;
  /** Directory path for material selector */
  _directory?: string;
  /** Transform function string for material values */
  _transform?: string;
  /** Confirm callback function string */
  _onconfirm?: string;
  /** Whether to enable code linting */
  _lint?: boolean;
  /** Template string for textarea */
  _template?: string;
  /** Whether to show preview */
  _preview?: boolean;
  /** JSON indentation level */
  indent?: number;
}

/** Comment object interface - defines the structure of table configuration */
export interface CommentObject {
  /** Type marker, typically 'object' */
  _type?: 'object';
  /** 
   * Child field configurations.
   * Can be a record of field configs or a function that returns config for a given key.
   */
  _data?: Record<string, FieldConfig | CommentObject> | ((key: string) => FieldConfig);
  /** Action function called during traversal */
  _action?: (args: FieldArgs) => void;
}

/** Table node representing a row in the table tree */
export interface TableNode {
  /** Unique identifier for this node */
  id: string;
  /** Field path, e.g., "['main']['floorIds']" */
  field: string;
  /** Short field name (last segment of path) */
  shortField: string;
  /** Whether this is a gap row (non-leaf node with children) */
  isGap: boolean;
  /** Current value (only for leaf nodes) */
  value?: unknown;
  /** Field configuration */
  config: FieldConfig;
  /** Full comment text */
  comment: string;
  /** Short comment for button display */
  shortComment?: string;
  /** Child nodes (only for gap nodes) */
  children?: TableNode[];
}

/** Props for the main Table component */
export interface TableProps {
  /** Data object to display/edit */
  data: Record<string, unknown>;
  /** Comment configuration object */
  commentObj: CommentObject;
  /** Callback when a value changes */
  onValueChange?: (field: string, value: unknown) => void;
  /** Callback when adding a new item */
  onAddItem?: (field: string, id: string) => void;
  /** Callback when deleting an item */
  onDeleteItem?: (field: string) => void;
  /** Callback when edit button is clicked - for external editor integration */
  onEditClick?: (field: string, type: FieldType | undefined, config: FieldConfig) => void;
  /** Callback when row is double-clicked - for external editor integration */
  onDoubleClick?: (field: string, type: FieldType | undefined, config: FieldConfig) => void;
}

/** Props for TableRow component */
export interface TableRowProps {
  /** Field path */
  field: string;
  /** Short field name */
  shortField: string;
  /** Current value */
  value: unknown;
  /** Field configuration */
  config: FieldConfig;
  /** Full comment text */
  comment: string;
  /** Short comment for display */
  shortComment?: string;
  /** Value change callback */
  onChange: (value: unknown) => void;
  /** Edit button click callback */
  onEditClick?: () => void;
  /** Double click callback */
  onDoubleClick?: () => void;
}

/** Props for GapRow component */
export interface GapRowProps {
  /** Field path */
  field: string;
  /** Short field name for display */
  shortField: string;
  /** Child nodes to render when expanded */
  children: React.ReactNode;
}

/** Return type for useFold hook */
export interface UseFoldReturn {
  /** Whether the current field is folded */
  isFolded: boolean;
  /** Toggle fold state */
  toggleFold: () => void;
}

/** Table context value interface */
export interface TableContextValue {
  /** Tree structure of table data */
  rootNodes: TableNode[];
  /** All foldable field paths */
  gapFields: string[];
  /** Set of currently folded field paths */
  foldedFields: Set<string>;
  /** Toggle fold state for a field */
  toggleFold: (field: string) => void;
  /** Fold all gap fields */
  foldAll: () => void;
  /** Unfold all gap fields */
  unfoldAll: () => void;
  /** Value change callback */
  onValueChange: (field: string, value: unknown) => void;
  /** Add item callback */
  onAddItem: (field: string, id: string) => void;
  /** Delete item callback */
  onDeleteItem: (field: string) => void;
}

/** Props for ActionButtons component */
export interface ActionButtonsProps {
  /** Whether to show comment button */
  showComment: boolean;
  /** Field type */
  type?: FieldType;
  /** Comment button click callback */
  onCommentClick?: () => void;
  /** Edit button click callback */
  onEditClick?: () => void;
  /** Copy button click callback */
  onCopyClick?: () => void;
}

/** Base props for input components */
export interface BaseInputProps {
  /** Current value */
  value: unknown;
  /** Value change callback */
  onChange: (value: unknown) => void;
  /** Whether the input is disabled */
  disabled?: boolean;
}

/** Props for TextareaInput component */
export interface TextareaInputProps extends BaseInputProps {
  /** JSON indentation level */
  indent?: number;
  /** Whether the input is readonly */
  readonly?: boolean;
}

/** Props for SelectInput component */
export interface SelectInputProps extends BaseInputProps {
  /** Available options */
  options: unknown[];
}

/** Props for CheckboxInput component */
export interface CheckboxInputProps extends Omit<BaseInputProps, 'value'> {
  /** Boolean value */
  value: boolean;
}

/** Props for CheckboxSet component */
export interface CheckboxSetProps extends BaseInputProps {
  /** Option keys */
  keys: (string | number)[];
  /** Option prefix labels */
  prefixStrings: string[];
}
