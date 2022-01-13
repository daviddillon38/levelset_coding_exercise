import React from "react";
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Drawer, makeStyles, Typography, Modal, TextField, MenuItem, Box } from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { useState } from 'react'
const data = require('./data.json');

const drawerWidth = 240;

const useStyles = makeStyles({
  page:{
    background: '#f9f9f9',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawer: {
    width: drawerWidth
  },
  drawerPaper: {
    width: drawerWidth
  },
  root: {
    display: 'flex'
  }, 
  photo: {
    height: "500px",
    width: "500px"
  }
})

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 215,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const centerView = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  p: 4,
}


const incrementViews = (state) => {
  state.views_count += 1;
}

const deleteEntry = (data, state) => {
  let catIndex = data.indexOf(state);
  data.splice(catIndex, 1);
}

const owners = ['John Doe', 'Jane Smith', 'Sam Jones', 'Claire Morrison'];

export default function Layout({ children }){
  const [state, setState] = useState(data[0]);
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [ownerName, setOwnerName] = React.useState(data[0].owner_name);
  const [image, setImage] = React.useState(data[0].thumbnail_url);
  const [birthday, setBirthday] = React.useState(data[0].birthdate);
  const [catName, setCatName] = React.useState(data[0].name);

  const handleOpen = () => {setOpen(true);};
  const handleClose = () => setOpen(false);
  const handleDeleteOpen = () => {setOpenDelete(true)}
  const handleDeleteClose = () => setOpenDelete(false);
  const classes = useStyles();

  const handleChange = (event) => {
    setOwnerName(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.value);
  }

  const handleCatNameChange = (event) => {
    setCatName(event.target.value);
  }

  const handleBirthdayChange = (event) => {
    setBirthday(event.target.value);
  }

  const updateInfo = (state) => {
    if(birthday[4] !== '-'){
      alert('Please enter correct date format: YYYY-MM-DD');
      return;
    }
    if(image.substring(0,5) !== 'https'){
      alert('Please enter a valid link for the image field');
      return;
    }
    state.name = catName;
    state.owner_name = ownerName;
    state.birthdate = birthday;
    state.thumbnail_url = image;
  }

 return (
   <div className={classes.root}>
     <Drawer
     className={classes.drawer}
     variant="permanent"
     anchor="left"
     classes={{ paper: classes.drawerPaper }}
     >
       <div>
         <Typography>
           Levelset Frontend Coding Exercise - David Dillon
         </Typography>
       </div>
        <List>
        <Divider component="li" />
          {data.map(item => {
            return(
              <div>
                <ListItem
                  alignItems="flex-start"
                  key={item.text}
                  button
                  onClick={()=> {
                    incrementViews(state);
                    setState(item);
                    setCatName(item.name);
                    setOwnerName(item.owner_name);
                    setBirthday(item.birthdate);
                    setImage(item.thumbnail_url);
                  }}
                >
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src={item.thumbnail_url} />
                </ListItemAvatar>
                  <Box>
                  <ListItemText primary={item.name}/>
                    <ListItemText primary={item.birthdate}/>
                  </Box>
                  
                </ListItem>
                <Divider component="li" />
              </div>
            );
            
        })}
        </List>
     </Drawer>
     
     <Box sx={centerView}>
     <img src={state.thumbnail_url} className={classes.photo} alt=' '/>
     <Box >
     <Typography display="block">Name: {state.name}</Typography>
     <Typography display="block">Birthday: {state.birthdate}</Typography>
     <Typography display="block">Owner: {state.owner_name}</Typography>
     <Typography display="block">Number of Views: {state.views_count + 1}</Typography>
      <Button 
      variant='contained'
      color='primary'
      onClick={handleOpen}>EDIT</Button>
      <Button
      variant='contained'
      color='secondary'
      onClick={handleDeleteOpen}
      >DELETE</Button>
     </Box>
     </Box>
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Cat
          </Typography>
          
        <TextField id="filled-basic" label="Image URL" variant="filled" defaultValue={state.thumbnail_url} onChange={handleImageChange}></TextField>
        <TextField id="filled-basic" label="Cat Name" variant="filled" defaultValue={state.name} onChange={handleCatNameChange}></TextField>
        <TextField id="filled-basic" label="Birth date" variant="filled" defaultValue={state.birthdate} onChange={handleBirthdayChange}></TextField>
        <Box
          component="form"
          sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}}
          noValidate
          autoComplete="off"
        >
        <TextField
          id="filled-select-currency"
          select
          label="Owner"
          defaultValue={state.owner_name}
          onChange={handleChange}
          variant="filled"
        >
          {owners.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        </Box>
        <Button onClick={() => {updateInfo(state); handleClose()}}> Save </Button>
        <Button onClick={handleClose}> Cancel </Button>
        </Box> 
      </Modal>
      <Modal 
      open={openDelete}
      onClose={handleDeleteClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete entry?
        </Typography>
        <Button onClick={()=>{
          deleteEntry(data, state)
          setState(data[0]);
          handleDeleteClose();}}
        >Yes</Button>
        <Button onClick={handleDeleteClose}>No</Button>
        </Box>
      </Modal>
    </div>
   </div>
 );
}

