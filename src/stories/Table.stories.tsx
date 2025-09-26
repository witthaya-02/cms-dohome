import type { Meta, StoryObj } from '@storybook/nextjs';
import { Table, type TableHeaderType, type TableColumn } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Table> = {
  title: 'components/ui/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    striped: {
      control: 'boolean',
      description: 'Enable striped rows for better readability',
    },
    hoverable: {
      control: 'boolean',
      description: 'Enable hover effects on table rows',
    },
    bordered: {
      control: 'boolean',
      description: 'Add borders around the table',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const sampleUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    status: 'Active',
    role: 'Admin',
    joinDate: '2023-01-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'Active',
    role: 'User',
    joinDate: '2023-02-20',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'Inactive',
    role: 'User',
    joinDate: '2023-03-10',
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice@example.com',
    status: 'Pending',
    role: 'Editor',
    joinDate: '2023-04-05',
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    status: 'Active',
    role: 'User',
    joinDate: '2023-05-12',
  },
];

const basicHeaders: TableHeaderType[] = [
  { field: 'id', label: 'ID' },
  { field: 'name', label: 'Name' },
  { field: 'email', label: 'Email' },
  { field: 'status', label: 'Status' },
  { field: 'role', label: 'Role' },
];

const sortableHeaders: TableHeaderType[] = [
  { field: 'id', label: 'ID', sort: true },
  { field: 'name', label: 'Name', sort: true },
  { field: 'email', label: 'Email' },
  { field: 'status', label: 'Status', sort: true },
  { field: 'role', label: 'Role', sort: true },
];

const searchableHeaders: TableHeaderType[] = [
  { field: 'id', label: 'ID' },
  { field: 'name', label: 'Name', search: true },
  { field: 'email', label: 'Email', search: true },
  { field: 'status', label: 'Status' },
  { field: 'role', label: 'Role', search: true },
];

const fullFeaturedHeaders: TableHeaderType[] = [
  { field: 'id', label: 'ID', sort: true },
  { field: 'name', label: 'Name', sort: true, search: true },
  { field: 'email', label: 'Email', search: true },
  { field: 'status', label: 'Status', sort: true },
  { field: 'role', label: 'Role', sort: true, search: true },
  { field: 'actions', label: 'Actions' },
];

const customColumns: TableColumn[] = [
  {
    field: 'id',
    render: (value) => (
      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">#{String(value)}</span>
    ),
  },
  {
    field: 'name',
    render: (value) => <div className="font-medium text-gray-900">{String(value)}</div>,
  },
  {
    field: 'status',
    render: (value) => {
      const statusStyles = {
        Active: 'bg-green-100 text-green-800 border-green-200',
        Inactive: 'bg-red-100 text-red-800 border-red-200',
        Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      };
      return (
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[value as keyof typeof statusStyles]}`}
        >
          {String(value)}
        </span>
      );
    },
  },
  {
    field: 'role',
    render: (value) => {
      const roleColors = {
        Admin: 'bg-purple-100 text-purple-800',
        Editor: 'bg-blue-100 text-blue-800',
        User: 'bg-gray-100 text-gray-800',
      };
      return (
        <span
          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${roleColors[value as keyof typeof roleColors]}`}
        >
          {String(value)}
        </span>
      );
    },
  },
  {
    field: 'actions',
    render: (_, row) => (
      <div className="flex gap-1">
        <Button size="sm" variant="outline" onClick={() => console.log('View', row)}>
          View
        </Button>
        <Button size="sm" variant="outline" onClick={() => console.log('Edit', row)}>
          Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={() => console.log('Delete', row)}>
          Delete
        </Button>
      </div>
    ),
  },
];

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Table</h3>
        <Table headers={basicHeaders} rows={sampleUsers.slice(0, 3)} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Sortable Columns</h3>
        <Table
          headers={sortableHeaders}
          rows={sampleUsers.slice(0, 3)}
          onSort={(field, order) => console.log(`Sorting ${field} ${order}`)}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Searchable Columns</h3>
        <Table
          headers={searchableHeaders}
          rows={sampleUsers.slice(0, 3)}
          onSearch={(field, value) => console.log(`Searching ${field}: ${value}`)}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Striped Rows</h3>
        <Table headers={basicHeaders} rows={sampleUsers} striped />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Bordered Table</h3>
        <Table headers={basicHeaders} rows={sampleUsers.slice(0, 3)} bordered />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Custom Rendering with Actions</h3>
        <Table
          headers={fullFeaturedHeaders}
          rows={sampleUsers}
          columns={customColumns}
          onSort={(field, order) => console.log(`Sorting ${field} ${order}`)}
          onSearch={(field, value) => console.log(`Searching ${field}: ${value}`)}
          striped
          hoverable
        />
      </div>
    </div>
  ),
};

export const Basic: Story = {
  args: {
    headers: basicHeaders,
    rows: sampleUsers.slice(0, 3),
    striped: false,
    hoverable: true,
    bordered: false,
  },
};

export const WithSorting: Story = {
  args: {
    headers: sortableHeaders,
    rows: sampleUsers,
    striped: false,
    hoverable: true,
    bordered: false,
    onSort: (field: string, order: 'asc' | 'desc') => {
      console.log(`Sorting ${field} ${order}`);
    },
  },
};

export const WithSearch: Story = {
  args: {
    headers: searchableHeaders,
    rows: sampleUsers,
    striped: false,
    hoverable: true,
    bordered: false,
    onSearch: (field: string, value: string) => {
      console.log(`Searching ${field}: ${value}`);
    },
  },
};

export const FullFeatured: Story = {
  args: {
    headers: fullFeaturedHeaders,
    rows: sampleUsers,
    columns: customColumns,
    striped: true,
    hoverable: true,
    bordered: false,
    onSort: (field: string, order: 'asc' | 'desc') => {
      console.log(`Sorting ${field} ${order}`);
    },
    onSearch: (field: string, value: string) => {
      console.log(`Searching ${field}: ${value}`);
    },
  },
};

export const EmptyState: Story = {
  args: {
    headers: basicHeaders,
    rows: [],
    striped: false,
    hoverable: true,
    bordered: false,
  },
};

export const Playground: Story = {
  args: {
    headers: fullFeaturedHeaders,
    rows: sampleUsers,
    columns: customColumns,
    striped: false,
    hoverable: true,
    bordered: false,
    onSort: (field: string, order: 'asc' | 'desc') => {
      console.log(`Sorting ss ${field} ${order}`);
    },
    onSearch: (field: string, value: string) => {
      console.log(`Searching ${field}: ${value}`);
    },
  },
};
