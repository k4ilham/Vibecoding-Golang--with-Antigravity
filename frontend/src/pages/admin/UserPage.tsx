import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/shared/data-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    MoreHorizontal,
    Eye,
    Edit,
    Archive,
    RotateCcw,
    Trash2,
    UserPlus
} from "lucide-react"
import type { User } from "@/types/user"
import { UserService } from "@/services/user.service"
import { format } from "date-fns"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function UserPage() {
    const [users, setUsers] = React.useState<User[]>([])
    const [, setLoading] = React.useState(true)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [isViewOpen, setIsViewOpen] = React.useState(false)
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
    const [formData, setFormData] = React.useState<Partial<User>>({
        name: '',
        email: '',
        role: 'customer'
    })

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await UserService.getUsers({ status: 'all' })
            setUsers(response.data.users)
        } catch (error) {
            console.error("Failed to fetch users", error)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchUsers()
    }, [])

    const handleEdit = (user: User) => {
        setSelectedUser(user)
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role
        })
        setIsDialogOpen(true)
    }

    const handleCreate = () => {
        setSelectedUser(null)
        setFormData({
            name: '',
            email: '',
            role: 'customer'
        })
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        try {
            if (selectedUser) {
                await UserService.updateUser(selectedUser.id, formData)
            } else {
                await UserService.createUser(formData)
            }
            setIsDialogOpen(false)
            fetchUsers()
        } catch (error) {
            console.error("Failed to save user", error)
        }
    }

    const handleArchive = async (id: number) => {
        if (confirm("Are you sure you want to archive this user?")) {
            await UserService.archiveUser(id)
            fetchUsers()
        }
    }

    const handleRestore = async (id: number) => {
        await UserService.restoreUser(id)
        fetchUsers()
    }

    const handleDelete = async (id: number) => {
        if (confirm("This action is permanent. Are you sure?")) {
            await UserService.deletePermanently(id)
            fetchUsers()
        }
    }

    const handleExport = (type: 'csv' | 'xlsx' | 'pdf') => {
        const exportData = users.map(u => ({
            ID: u.id,
            Name: u.name,
            Email: u.email,
            Role: u.role,
            Status: u.deleted_at ? 'Archived' : 'Active',
            Created: format(new Date(u.created_at), 'yyyy-MM-dd HH:mm')
        }))

        if (type === 'xlsx' || type === 'csv') {
            const ws = XLSX.utils.json_to_sheet(exportData)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, "Users")
            XLSX.writeFile(wb, `users_export_${format(new Date(), 'yyyyMMdd')}.${type === 'xlsx' ? 'xlsx' : 'csv'}`)
        } else if (type === 'pdf') {
            const doc = new jsPDF()
            autoTable(doc, {
                head: [['ID', 'Name', 'Email', 'Role', 'Status', 'Created']],
                body: exportData.map(u => [u.ID, u.Name, u.Email, u.Role, u.Status, u.Created]),
            })
            doc.save(`users_export_${format(new Date(), 'yyyyMMdd')}.pdf`)
        }
    }

    const isArchived = (u: any) => {
        if (!u.deleted_at) return false;
        if (typeof u.deleted_at === 'object') return u.deleted_at.Valid;
        return true;
    }

    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        customers: users.filter(u => u.role === 'customer').length,
        archived: users.filter(u => isArchived(u)).length
    }

    const columns: ColumnDef<User>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => {
                const role = row.getValue("role") as string
                return (
                    <Badge variant={role === 'admin' ? 'default' : 'secondary'}>
                        {role}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "deleted_at",
            header: "Status",
            cell: ({ row }) => {
                const archived = isArchived(row.original)
                return (
                    <Badge variant={archived ? 'warning' : 'success'}>
                        {archived ? 'Archived' : 'Active'}
                    </Badge>
                )
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original
                const archived = isArchived(user)

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsViewOpen(true); }}>
                                <Eye className="mr-2 h-4 w-4" /> Show
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(user)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {archived ? (
                                <DropdownMenuItem onClick={() => handleRestore(user.id)} className="text-emerald-600">
                                    <RotateCcw className="mr-2 h-4 w-4" /> Restore
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={() => handleArchive(user.id)} className="text-amber-600">
                                    <Archive className="mr-2 h-4 w-4" /> Archive
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700">
                    <UserPlus className="mr-2 h-4 w-4" /> Add User
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-2xl shadow-sm border-blue-100 bg-white/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
                        <UserPlus className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground mt-1">Global accounts</p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl shadow-sm border-blue-100 bg-white/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Admins</CardTitle>
                        <Badge variant="outline" className="border-primary text-primary">Priority</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.admins}</div>
                        <p className="text-xs text-muted-foreground mt-1">Privileged users</p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl shadow-sm border-blue-100 bg-white/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Customers</CardTitle>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">Retail</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.customers}</div>
                        <p className="text-xs text-muted-foreground mt-1">Active clients</p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl shadow-sm border-blue-100 bg-white/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Archived</CardTitle>
                        <Archive className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">{stats.archived}</div>
                        <p className="text-xs text-muted-foreground mt-1">Soft deleted</p>
                    </CardContent>
                </Card>
            </div>

            <DataTable
                columns={columns}
                data={users}
                searchKey="name"
                onExport={handleExport}
            />

            {/* Edit/Create Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="customer">Customer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 border-b pb-2">
                                <span className="font-semibold text-muted-foreground">ID</span>
                                <span className="col-span-2">{selectedUser.id}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b pb-2">
                                <span className="font-semibold text-muted-foreground">Name</span>
                                <span className="col-span-2">{selectedUser.name}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b pb-2">
                                <span className="font-semibold text-muted-foreground">Email</span>
                                <span className="col-span-2">{selectedUser.email}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b pb-2">
                                <span className="font-semibold text-muted-foreground">Role</span>
                                <span className="col-span-2 capitalize">{selectedUser.role}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <span className="font-semibold text-muted-foreground">Joined</span>
                                <span className="col-span-2">{format(new Date(selectedUser.created_at), 'PPPp')}</span>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setIsViewOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
