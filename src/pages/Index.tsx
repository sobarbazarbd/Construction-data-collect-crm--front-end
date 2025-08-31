import { useState, useEffect } from 'react';
import { ContractorTable } from '../components/ContractorTable';
import { ContractorForm } from '../components/ContractorForm';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { Download, Plus, Search, Users } from 'lucide-react';

interface Contractor {
  id: number;
  sNo: number;
  name: string;
  contactNo: string;
  address: string;
  remarks: string;
}

const initialContractors: Contractor[] = [
  { id: 1, sNo: 1, name: "Farooq Ahmed", contactNo: "+880 17 1128 4718", address: "", remarks: "Piling work Ref Eng Mostafiz, Codda" },
  { id: 2, sNo: 2, name: "Pintu Contactor", contactNo: "+880 16 7435 1165", address: "Cantonment", remarks: "PCO work" },
  { id: 3, sNo: 3, name: "Eng Sonjoy Spectra", contactNo: "+880 17 1598 8470", address: "Spectra", remarks: "" },
  { id: 4, sNo: 4, name: "Eng Hanif Ref Hasan Bashundhara", contactNo: "+880 17 1478 9240", address: "", remarks: "" },
  { id: 5, sNo: 5, name: "Eng Haroon CC 90", contactNo: "+880 18 1938 1120", address: "", remarks: "" },
  { id: 6, sNo: 6, name: "Shakil Rahman", contactNo: "+880 17 2254 8901", address: "Dhanmondi", remarks: "Electrical work specialist" },
  { id: 7, sNo: 7, name: "Md. Karim Builder", contactNo: "+880 19 1567 3421", address: "Uttara", remarks: "Foundation work" },
  { id: 8, sNo: 8, name: "Rahman Construction", contactNo: "+880 16 8899 4567", address: "Gulshan", remarks: "Steel structure work" },
  { id: 9, sNo: 9, name: "Nasir Ahmed", contactNo: "+880 17 5566 7788", address: "Mirpur", remarks: "Roofing specialist" },
  { id: 10, sNo: 10, name: "Elite Builders", contactNo: "+880 18 9988 7766", address: "Banani", remarks: "Complete construction" },
  { id: 11, sNo: 11, name: "Sumon Contractor", contactNo: "+880 17 4433 2211", address: "Mohammadpur", remarks: "Plumbing work" },
  { id: 12, sNo: 12, name: "Green Construction", contactNo: "+880 19 6677 8899", address: "Bashundhara", remarks: "Eco-friendly construction" },
  { id: 13, sNo: 13, name: "Alam Builders", contactNo: "+880 16 5544 3322", address: "Tejgaon", remarks: "Commercial buildings" },
  { id: 14, sNo: 14, name: "Modern Tech", contactNo: "+880 17 7788 9900", address: "Wari", remarks: "Smart home systems" },
  { id: 15, sNo: 15, name: "Rapid Construction", contactNo: "+880 18 1122 3344", address: "Ramna", remarks: "Fast completion projects" },
  { id: 16, sNo: 16, name: "SafeBuild Ltd", contactNo: "+880 19 9900 1122", address: "New Market", remarks: "Safety compliance specialist" },
  { id: 17, sNo: 17, name: "Urban Developers", contactNo: "+880 17 3344 5566", address: "Panthapath", remarks: "Urban planning projects" },
  { id: 18, sNo: 18, name: "Quality Works", contactNo: "+880 16 7766 5544", address: "Lalmatia", remarks: "Quality assurance" },
  { id: 19, sNo: 19, name: "Pro Builders", contactNo: "+880 18 2233 4455", address: "Farmgate", remarks: "Professional construction" },
  { id: 20, sNo: 20, name: "Innovative Construct", contactNo: "+880 19 5566 7788", address: "Shantinagar", remarks: "Innovative building solutions" },
  { id: 21, sNo: 21, name: "Reliable Contractors", contactNo: "+880 17 8899 0011", address: "Malibagh", remarks: "Reliable service provider" },
  { id: 22, sNo: 22, name: "Express Builders", contactNo: "+880 16 1122 3344", address: "Segunbagicha", remarks: "Express delivery projects" },
  { id: 23, sNo: 23, name: "Smart Solutions", contactNo: "+880 18 4455 6677", address: "Eskaton", remarks: "Technology integrated construction" },
  { id: 24, sNo: 24, name: "Premier Construction", contactNo: "+880 19 7788 9900", address: "Bailey Road", remarks: "Premium quality work" }
];

const Index = () => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRemarks, setFilterRemarks] = useState('all');
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedContractors = localStorage.getItem('contractors');
    if (savedContractors) {
      setContractors(JSON.parse(savedContractors));
    } else {
      setContractors(initialContractors);
      localStorage.setItem('contractors', JSON.stringify(initialContractors));
    }
  }, []);

  // Save to localStorage whenever contractors change
  useEffect(() => {
    if (contractors.length > 0) {
      localStorage.setItem('contractors', JSON.stringify(contractors));
    }
  }, [contractors]);

  // Generate unique ID for new contractors
  const generateId = () => {
    return Math.max(...contractors.map(c => c.id), 0) + 1;
  };

  // Update serial numbers after add/delete operations
  const updateSerialNumbers = (contractorList: Contractor[]) => {
    return contractorList.map((contractor, index) => ({
      ...contractor,
      sNo: index + 1
    }));
  };

  // Add new contractor
  const handleAddContractor = (contractorData: Omit<Contractor, 'id' | 'sNo'>) => {
    const newContractor = {
      ...contractorData,
      id: generateId(),
      sNo: contractors.length + 1
    };
    const updatedContractors = [...contractors, newContractor];
    setContractors(updateSerialNumbers(updatedContractors));
    setIsFormOpen(false);
    toast({
      title: "Success",
      description: "Contractor added successfully!",
    });
  };

  // Update existing contractor
  const handleUpdateContractor = (contractorData: Omit<Contractor, 'id' | 'sNo'>) => {
    if (!editingContractor) return;
    
    const updatedContractors = contractors.map(contractor =>
      contractor.id === editingContractor.id
        ? { ...contractor, ...contractorData }
        : contractor
    );
    setContractors(updatedContractors);
    setEditingContractor(null);
    setIsFormOpen(false);
    toast({
      title: "Success",
      description: "Contractor updated successfully!",
    });
  };

  // Delete contractor
  const handleDeleteContractor = (id: number) => {
    const updatedContractors = contractors.filter(contractor => contractor.id !== id);
    setContractors(updateSerialNumbers(updatedContractors));
    toast({
      title: "Success",
      description: "Contractor deleted successfully!",
    });
  };

  // Edit contractor
  const handleEditContractor = (contractor: Contractor) => {
    setEditingContractor(contractor);
    setIsFormOpen(true);
  };

  // Filter and search contractors
  const filteredContractors = contractors.filter(contractor => {
    const matchesSearch = 
      contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.contactNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.remarks.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterRemarks === 'all' || 
      (filterRemarks === 'empty' && !contractor.remarks) ||
      (filterRemarks !== 'empty' && contractor.remarks.toLowerCase().includes(filterRemarks.toLowerCase()));

    return matchesSearch && matchesFilter;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Serial No', 'Name', 'Contact No', 'Address', 'Remarks'];
    const csvContent = [
      headers.join(','),
      ...filteredContractors.map(contractor => [
        contractor.sNo,
        `"${contractor.name}"`,
        `"${contractor.contactNo}"`,
        `"${contractor.address}"`,
        `"${contractor.remarks}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contractors_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success",
      description: "Contractors exported to CSV successfully!",
    });
  };

  // Get unique remarks for filter dropdown
  const uniqueRemarks = Array.from(new Set(contractors.map(c => c.remarks).filter(r => r.trim())));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Card className="shadow-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-3xl text-foreground">
                <Users className="h-8 w-8 text-primary" />
                Contractor Management System
              </CardTitle>
              <CardDescription className="text-lg">
                Manage your construction contractors efficiently with full CRUD operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contractors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <Select value={filterRemarks} onValueChange={setFilterRemarks}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by remarks" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Contractors</SelectItem>
                      <SelectItem value="empty">No Remarks</SelectItem>
                      {uniqueRemarks.map(remark => (
                        <SelectItem key={remark} value={remark}>
                          {remark.substring(0, 30)}...
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleExportCSV}
                    variant="outline"
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingContractor(null);
                      setIsFormOpen(true);
                    }}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Contractor
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-professional">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Contractors</p>
                  <p className="text-2xl font-bold text-foreground">{contractors.length}</p>
                </div>
                <Users className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-professional">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Filtered Results</p>
                  <p className="text-2xl font-bold text-accent">{filteredContractors.length}</p>
                </div>
                <Search className="h-6 w-6 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-professional">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">With Remarks</p>
                  <p className="text-2xl font-bold text-warning">{contractors.filter(c => c.remarks).length}</p>
                </div>
                <div className="h-6 w-6 rounded-full bg-warning/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <ContractorTable
          contractors={filteredContractors}
          onEdit={handleEditContractor}
          onDelete={handleDeleteContractor}
        />

        {/* Form Modal */}
        <ContractorForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingContractor(null);
          }}
          onSubmit={editingContractor ? handleUpdateContractor : handleAddContractor}
          initialData={editingContractor}
        />
      </div>
    </div>
  );
};

export default Index;