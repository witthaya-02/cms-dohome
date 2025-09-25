import * as React from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from './input';

interface TableHeaderConfig {
  field: string;
  label: string;
  sort?: boolean;
  search?: boolean;
  width?: string;
}

interface TableRowData {
  [key: string]: unknown;
}

interface TableColumn {
  field: string;
  render?: (value: unknown, row: TableRowData) => React.ReactNode;
}

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  headers: TableHeaderConfig[];
  rows: TableRowData[];
  columns?: TableColumn[];
  onSort?: (field: string, order: 'asc' | 'desc') => void;
  onSearch?: (field: string, value: string) => void;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
}

interface TableRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function TableRoot({ className, ...props }: TableRootProps) {
  return (
    <div data-slot="table-root" className={cn('w-full overflow-auto', className)} {...props} />
  );
}

function Table({
  className,
  headers,
  rows,
  columns,
  onSort,
  onSearch,
  striped = false,
  hoverable = true,
  bordered = false,
  ...props
}: TableProps) {
  const [sortField, setSortField] = React.useState<string | null>(null);
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [searchValues, setSearchValues] = React.useState<Record<string, string>>({});

  const handleSort = (field: string) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    onSort?.(field, newOrder);
  };

  const handleSearch = (field: string, value: string) => {
    setSearchValues((prev) => ({ ...prev, [field]: value }));
    onSearch?.(field, value);
  };

  const getColumnConfig = (field: string): TableColumn | undefined => {
    return columns?.find((col) => col.field === field);
  };

  const renderCell = (row: TableRowData, field: string) => {
    const column = getColumnConfig(field);
    const value = row[field];

    if (column?.render) {
      return column.render(value, row);
    }

    return value?.toString() || '';
  };

  return (
    <TableRoot className={className}>
      <table
        data-slot="table"
        className={cn('w-full caption-bottom text-sm', bordered && 'border border-border')}
        {...props}
      >
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header.field} className={header.width}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span>{header.label}</span>
                    {header.sort && (
                      <TableSortButton
                        onClick={() => handleSort(header.field)}
                        active={sortField === header.field}
                        order={sortOrder}
                        label={header.label}
                      />
                    )}
                  </div>
                  {header.search && (
                    <TableSearchInput
                      placeholder={`Search ${header.label.toLowerCase()}...`}
                      value={searchValues[header.field] || ''}
                      onChange={(value) => handleSearch(header.field, value)}
                    />
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex} striped={striped && rowIndex % 2 === 0} hoverable={hoverable}>
              {headers.map((header) => (
                <TableCell key={`${rowIndex}-${header.field}`}>
                  {renderCell(row, header.field)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </table>
    </TableRoot>
  );
}

function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead data-slot="table-header" className={cn('[&_tr]:border-b', className)} {...props} />;
}

function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
}

function TableRow({
  className,
  striped = false,
  hoverable = false,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & {
  striped?: boolean;
  hoverable?: boolean;
}) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'border-b transition-colors data-[state=selected]:bg-muted',
        hoverable && 'hover:bg-muted/50',
        striped && 'bg-muted/20',
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('mt-4 text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

function TableSortButton({
  onClick,
  active,
  order,
  label,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active: boolean;
  order: 'asc' | 'desc';
  label: string;
}) {
  return (
    <button
      data-slot="table-sort-button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-7 w-7',
        className
      )}
      aria-label={`Sort by ${label}`}
      {...props}
    >
      {active ? (
        order === 'asc' ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )
      ) : (
        <ChevronDown className="h-4 w-4 opacity-30" />
      )}
    </button>
  );
}

function TableSearchInput({
  placeholder,
  value,
  onChange,
  className,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        data-slot="table-search-input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn('h-7 w-full pl-7 text-xs', className)}
        {...props}
      />
    </div>
  );
}

export {
  Table,
  TableRoot,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableSortButton,
  TableSearchInput,
  type TableHeaderConfig as TableHeaderType,
  type TableRowData as TableRowType,
  type TableColumn,
};
