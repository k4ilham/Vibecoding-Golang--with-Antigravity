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
    PlusCircle
} from "lucide-react"
import type { Service } from "@/types/service"
import { LaundryService } from "@/services/service.service"
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

export default function LayananPage() {
    const [services, setServices] = React.useState<Service[]>([])
    const [, setLoading] = React.useState(true)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [isViewOpen, setIsViewOpen] = React.useState(false)
    const [selectedService, setSelectedService] = React.useState<Service | null>(null)
    const [formData, setFormData] = React.useState<Partial<Service>>({
        name: '',
        description: '',
        unit: 'kg',
        price: 0
    })

    const fetchServices = async () => {
        try {
            setLoading(true)
            const response = await LaundryService.getServices({ status: 'all' })
            setServices(response.data.services)
        } catch (error) {
            console.error("Failed to fetch services", error)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchServices()
    }, [])

    const handleEdit = (service: Service) => {
        setSelectedService(service)
        setFormData({
            name: service.name,
            description: service.description,
            unit: service.unit,
            price: service.price
        })
        setIsDialogOpen(true)
    }

    const handleCreate = () => {
        setSelectedService(null)
        setFormData({
            name: '',
            description: '',
            unit: 'kg',
            price: 0
        })
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        try {
            if (selectedService) {
                await LaundryService.updateService(selectedService.id, formData)
            } else {
                await LaundryService.createService(formData)
            }
            setIsDialogOpen(false)
            fetchServices()
        } catch (error) {
            console.error("Failed to save service", error)
        }
    }

    const handleArchive = async (id: number) => {
        if (confirm("Are you sure you want to archive this service?")) {
            await LaundryService.archiveService(id)
            fetchServices()
        }
    }

    const handleRestore = async (id: number) => {
        await LaundryService.restoreService(id)
        fetchServices()
    }

    const handleDelete = async (id: number) => {
        if (confirm("This action is permanent. Are you sure?")) {
            await LaundryService.deletePermanently(id)
            fetchServices()
        }
    }

    const handleExport = (type: 'csv' | 'xlsx' | 'pdf') => {
        const exportData = services.map(s => ({
            ID: s.id,
            Name: s.name,
            Description: s.description,
            Unit: s.unit,
            Price: s.price,
            Status: s.deleted_at ? 'Archived' : 'Active'
        }))

        if (type === 'xlsx' || type === 'csv') {
            const ws = XLSX.utils.json_to_sheet(exportData)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, "Services")
            XLSX.writeFile(wb, `services_export_${format(new Date(), 'yyyyMMdd')}.${type === 'xlsx' ? 'xlsx' : 'csv'}`)
        } else if (type === 'pdf') {
            const doc = new jsPDF()
            autoTable(doc, {
                head: [['ID', 'Name', 'Description', 'Unit', 'Price', 'Status']],
                body: exportData.map(s => [s.ID, s.Name, s.Description, s.Unit, s.Price, s.Status]),
            })
            doc.save(`services_export_${format(new Date(), 'yyyyMMdd')}.pdf`)
        }
    }

    const isArchived = (u: any) => {
        if (!u.deleted_at) return false;
        if (typeof u.deleted_at === 'object') return u.deleted_at.Valid;
        return true;
    }

    const stats = {
        total: services.length,
        active: services.filter(s => !isArchived(s)).length,
        archived: services.filter(s => isArchived(s)).length,
        avgPrice: services.length > 0
            ? services.reduce((acc, s) => acc + s.price, 0) / services.length
            : 0
    }

    const columns: ColumnDef<Service>[] = [
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
            header: "Service Name",
            cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "unit",
            header: "Unit",
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => {
                const price = parseFloat(row.getValue("price"))
                const formatted = new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                }).format(price)
                return <div className="font-medium">{formatted}</div>
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
            cell: ({ row }) => {
                const service = row.original
                const archived = isArchived(service)

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
                            <DropdownMenuItem onClick={() => { setSelectedService(service); setIsViewOpen(true); }}>
                                <Eye className="mr-2 h-4 w-4" /> Show
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(service)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {archived ? (
                                <DropdownMenuItem onClick={() => handleRestore(service.id)} className="text-emerald-600">
                                    <RotateCcw className="mr-2 h-4 w-4" /> Restore
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={() => handleArchive(service.id)} className="text-amber-600">
                                    <Archive className="mr-2 h-4 w-4" /> Archive
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleDelete(service.id)} className="text-destructive">
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
                <h2 className="text-3xl font-bold tracking-tight">Services Management</h2>
                <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Service
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-2xl shadow-sm border-blue-100 bg-white/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Services</CardTitle>
                        <PlusCircle className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground mt-1">Available offerings</p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl shadow-sm border-blue-100 bg-white/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Active</CardTitle>
                        <Badge variant="success" className="bg-emerald-50 text-emerald-700">Live</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">{stats.active}</div>
                        <p className="text-xs text-muted-foreground mt-1">Ready to book</p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl shadow-sm border-blue-100 bg-white/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Archived</CardTitle>
                        <Archive className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">{stats.archived}</div>
                        <p className="text-xs text-muted-foreground mt-1">Currently hidden</p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl shadow-sm border-blue-100 bg-white/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Avg. Price</CardTitle>
                        <div className="text-xs font-bold text-blue-600">IDR</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(stats.avgPrice)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Mean rate</p>
                    </CardContent>
                </Card>
            </div>

            <DataTable
                columns={columns}
                data={services}
                searchKey="name"
                onExport={handleExport}
            />

            {/* Edit/Create Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Service Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="unit">Unit</Label>
                                <Select
                                    value={formData.unit}
                                    onValueChange={(value: any) => setFormData({ ...formData, unit: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                                        <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                                        <SelectItem value="m2">Meter Square (m2)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price (IDR)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Service Details</DialogTitle>
                    </DialogHeader>
                    {selectedService && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 border-b pb-2">
                                <span className="font-semibold text-muted-foreground">Name</span>
                                <span className="col-span-2">{selectedService.name}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b pb-2">
                                <span className="font-semibold text-muted-foreground">Description</span>
                                <span className="col-span-2">{selectedService.description}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-b pb-2">
                                <span className="font-semibold text-muted-foreground">Price</span>
                                <span className="col-span-2">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(selectedService.price)} / {selectedService.unit}</span>
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
