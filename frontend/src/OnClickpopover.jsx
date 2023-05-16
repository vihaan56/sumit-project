import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { TextField } from '@mui/material';
import MeetingRoomTwoToneIcon from '@mui/icons-material/MeetingRoomTwoTone';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

const rand_id = uuidv4();

export default function BasicPopover() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    

    const navigate = useNavigate();
    const [roomId, setRoomId] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [helper, setHelper] = useState("Please enter title of your room");

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const formSubmit = (e) => {
        e.preventDefault();

        setRoomId(e.target.value)
        console.log(roomId);
        if (title === '') {
            setError(true)
            setHelper('Please fill this field')
        }
        else {
            
            setError(false)
            setHelper('Please enter title of your room')
            navigate(`/newroom/${rand_id}`)
        }
        
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <Button color='primary' size='small' sx={{ borderRadius: 5, marginRight: 4, marginBottom: 4 }} startIcon={<AddIcon />} aria-describedby={id} variant="contained" onClick={handleClick}>
                Create Room
            </Button>
            <Popover
                sx={{ marginTop: 0.5, borderRadius: 7 }}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
            
                <Typography sx={{ p: 2 }}>
                    
                    <form noValidate onSubmit={formSubmit}>
                    <TextField
                        required
                        error={error}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ display: 'flex', mb: 3 }}
                        size='small'
                        helperText={helper}
                        id="demo-helper-text-misaligned"
                        label="Title"
                    />

                    <TextField
                        sx={{ display: 'flex', mb: 1 }}
                        size='small'
                        helperText="Share this "
                        id="demo-helper-text-misaligned"
                        label="Room-ID"
                        value={rand_id}
                    />

                        <LoadingButton
                        type="submit"
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<MeetingRoomTwoToneIcon />}
                        variant="outlined"
                    >
                       Enter Room
                    </LoadingButton>
                </form>
                </Typography>
           
        </Popover>
        </div >
    );
}