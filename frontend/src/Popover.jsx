import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function MouseOverPopover(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {  
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <div>
            <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
            
                {props.children === 'chat' && <CommentRoundedIcon  sx={{ fontSize: 30 }} style={{ marginRight: 30, cursor: 'pointer' }} />}
                {props.children === 'log' && <PublishedWithChangesIcon sx={{ fontSize: 30 }} style={{ marginRight: 30, cursor: 'pointer' }} />}
                {props.children === 'acc' && <AccountCircleIcon sx={{ fontSize: 30 }} style={{ marginRight: 30, cursor: 'pointer' }} />}

            </Typography>
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{ p: 1 }}>
                    {props.children === 'chat' && <Typography> This is chatbox </Typography>}
                    {props.children === 'log' && <Typography > These are logs </Typography>}
                    {props.children === 'acc' && <Typography > This is acc </Typography>}
                </Typography>
            </Popover>
        </div>
    );
}