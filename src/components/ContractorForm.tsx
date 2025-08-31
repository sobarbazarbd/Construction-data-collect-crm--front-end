import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent } from './ui/card';
import { User, Phone, MapPin, MessageSquare, Save, X } from 'lucide-react';

interface Contractor {
  id: number;
  sNo: number;
  name: string;
  contactNo: string;
  address: string;
  remarks: string;
}

interface ContractorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contractor: Omit<Contractor, 'id' | 'sNo'>) => void;
  initialData?: Contractor | null;
}

export const ContractorForm = ({ isOpen, onClose, onSubmit, initialData }: ContractorFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    contactNo: '',
    address: '',
    remarks: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          contactNo: initialData.contactNo,
          address: initialData.address,
          remarks: initialData.remarks
        });
      } else {
        setFormData({
          name: '',
          contactNo: '',
          address: '',
          remarks: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.contactNo.trim()) {
      newErrors.contactNo = 'Contact number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.contactNo)) {
      newErrors.contactNo = 'Please enter a valid contact number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      onSubmit({
        name: formData.name.trim(),
        contactNo: formData.contactNo.trim(),
        address: formData.address.trim(),
        remarks: formData.remarks.trim()
      });
      
      // Reset form
      setFormData({
        name: '',
        contactNo: '',
        address: '',
        remarks: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="h-6 w-6 text-primary" />
            {initialData ? 'Edit Contractor' : 'Add New Contractor'}
          </DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Update the contractor information below.' 
              : 'Fill in the details to add a new contractor to your system.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-sm">
            <CardContent className="pt-6 space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4 text-primary" />
                  Contractor Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter contractor name"
                  className={errors.name ? 'border-destructive focus:ring-destructive' : ''}
                  disabled={isSubmitting}
                  autoFocus
                />
                {errors.name && (
                  <p className="text-sm text-destructive font-medium">{errors.name}</p>
                )}
              </div>

              {/* Contact Number Field */}
              <div className="space-y-2">
                <Label htmlFor="contactNo" className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4 text-primary" />
                  Contact Number *
                </Label>
                <Input
                  id="contactNo"
                  value={formData.contactNo}
                  onChange={(e) => handleInputChange('contactNo', e.target.value)}
                  placeholder="e.g., +880 17 1234 5678"
                  className={errors.contactNo ? 'border-destructive focus:ring-destructive' : ''}
                  disabled={isSubmitting}
                />
                {errors.contactNo && (
                  <p className="text-sm text-destructive font-medium">{errors.contactNo}</p>
                )}
              </div>

              {/* Address Field */}
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-primary" />
                  Address
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter address (optional)"
                  disabled={isSubmitting}
                />
              </div>

              {/* Remarks Field */}
              <div className="space-y-2">
                <Label htmlFor="remarks" className="flex items-center gap-2 text-sm font-medium">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Remarks
                </Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  placeholder="Add any notes, specialization, or additional information..."
                  className="min-h-[100px] resize-none"
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting 
                ? (initialData ? 'Updating...' : 'Adding...') 
                : (initialData ? 'Update Contractor' : 'Add Contractor')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};