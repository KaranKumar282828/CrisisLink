import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add, Delete, Phone, Person } from '@mui/icons-material';
import api from '../../services/api';

const EmergencyContacts = () => {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phoneNumber: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      // For now, we'll use mock data since this endpoint might not exist
      // const response = await api.get('/users/emergency-contacts');
      // setContacts(response.data.contacts);
      
      // Mock data for demo
      setContacts([
        { id: 1, name: 'Family Member', phoneNumber: '+919876543210' },
        { id: 2, name: 'Close Friend', phoneNumber: '+919876543211' }
      ]);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  };

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phoneNumber) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      // Mock API call - replace with actual endpoint
      // await api.post('/users/emergency-contacts', newContact);
      
      const newContactObj = {
        id: Date.now(),
        ...newContact
      };

      setContacts([...contacts, newContactObj]);
      setNewContact({ name: '', phoneNumber: '' });
      setError('');
    } catch (error) {
      setError('Failed to add contact');
    }
    setLoading(false);
  };

  const handleDeleteContact = async (contactId) => {
    try {
      // Mock API call
      // await api.delete(`/users/emergency-contacts/${contactId}`);
      
      setContacts(contacts.filter(contact => contact.id !== contactId));
    } catch (error) {
      setError('Failed to delete contact');
    }
  };

  const handleEmergencyCall = (phoneNumber) => {
    if (window.confirm(`Call ${phoneNumber}?`)) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<Phone />}
        onClick={() => setOpen(true)}
        className="action-btn"
      >
        Emergency Contacts
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Phone sx={{ mr: 1 }} />
            Emergency Contacts
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Add people to notify in case of emergency
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Add Contact Form */}
          <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Add New Contact
            </Typography>
            <TextField
              fullWidth
              label="Name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              margin="normal"
              size="small"
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={newContact.phoneNumber}
              onChange={(e) => setNewContact({ ...newContact, phoneNumber: e.target.value })}
              margin="normal"
              size="small"
              placeholder="+919876543210"
            />
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} /> : <Add />}
              onClick={handleAddContact}
              disabled={loading}
              sx={{ mt: 1 }}
            >
              Add Contact
            </Button>
          </Box>

          {/* Contacts List */}
          <Typography variant="subtitle2" gutterBottom>
            Your Emergency Contacts
          </Typography>
          
          {contacts.length === 0 ? (
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
              No emergency contacts added yet
            </Typography>
          ) : (
            <List>
              {contacts.map((contact) => (
                <ListItem key={contact.id} divider>
                  <Person sx={{ mr: 2, color: 'primary.main' }} />
                  <ListItemText
                    primary={contact.name}
                    secondary={contact.phoneNumber}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleEmergencyCall(contact.phoneNumber)}
                      sx={{ mr: 1 }}
                    >
                      <Phone color="primary" />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteContact(contact.id)}
                    >
                      <Delete color="error" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmergencyContacts;