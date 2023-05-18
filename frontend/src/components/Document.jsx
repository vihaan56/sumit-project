import React from 'react';
// import { Button } from '@mui/material';
import { Avatar, Button, Card, CardContent, Chip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Height } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';

const PreviousDocuments = () => {
    const navigate = useNavigate();
    const documents = ['Document 1', 'Document 2', 'Document 3', 'Document 4', 'Document 5', 'Document 6']; // Example list of previous documents

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <Button onClick={() => navigate('/editor/0b060dd5-b6ad-45')} variant="contained" color="primary" size="large" style={{ display: 'block' }} sx={{ mt: 2, ml: 'auto', mr: 'auto' }}>
                    Create New Document
                </Button>

                <Chip
                    avatar={<Avatar alt="Natacha" src="/static/images/avatar/1.jpg" />}
                    label="Avatar"
                    variant="contained"
                    sx={{mt:'1.5rem',mr:'5rem'}}  
                />
            </div>

            {/* <Chip avatar={<Avatar>M</Avatar>} label="Avatar" /> */}
           

            <Typography variant="h5" style={{ textAlign: 'center', margin: '2rem 0' }}>
                Previous Documents
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem', }}>
                {documents.map((document, index) => (
                    <Card key={index} style={{ width: '200px', margin: '0 1rem', }}>
                        <CardContent>
                            <Typography variant="h6" component="h2">
                                {document}
                                <DeleteIcon sx={{ ml: '2.15rem', cursor: 'pointer', color: 'red' }} />
                            </Typography>
                            <Typography color="textSecondary" >
                                Document
                                <VisibilityIcon sx={{ cursor: 'pointer', ml: '4.3rem' }} />
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default PreviousDocuments;