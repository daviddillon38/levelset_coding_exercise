import React from "react";
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Drawer, makeStyles, Typography, Modal, TextField, MenuItem, Box, IconButton, InputBase } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
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

//styling for edit cat modal
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

//styling to center the selected cat on page
const centerView = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  p: 4,
}

//input: currently selected cat object --> increments the views on that object(line 174)
const incrementViews = (state) => {
  state.views_count += 1;
}

//input data: array of all cats loaded
//input state: object of currently selected cat
// --> removes the current cat selected from data array(line 259)
const deleteEntry = (data, state) => {
  let catIndex = data.indexOf(state);
  data.splice(catIndex, 1);
}

const owners = [];
for(let i = 0; i < data.length; i++){
  if(owners.indexOf(data[i].owner_name) === -1){
    owners.push(data[i].owner_name);
  }
}

//main layout component, renders all components to the page
export default function Layout({ children }){
  
  const [state, setState] = useState(data[0]); //current selected cat
  const [open, setOpen] = React.useState(false); //edit cat modal boolean
  const [openDelete, setOpenDelete] = React.useState(false);//delete cat modal boolean
  const [ownerName, setOwnerName] = React.useState(data[0].owner_name);//owner name of selected cat for edit cat modal
  const [image, setImage] = React.useState(data[0].thumbnail_url);//imageURL of selected cat for edit cat modal
  const [birthday, setBirthday] = React.useState(data[0].birthdate);//birthdate of selected cat for edit cat modal
  const [catName, setCatName] = React.useState(data[0].name);//cat name of selected cat for edit cat modal
  const [search, setSearch] = React.useState('');//string for search bar
  //handleOpen/Close used for edit cat modal 
  const handleOpen = () => {setOpen(true);};
  const handleClose = () => setOpen(false);

  //handleOpen/Close used for delete cat modal 
  const handleDeleteOpen = () => {setOpenDelete(true)};//(line 207)
  const handleDeleteClose = () => setOpenDelete(false);//(line 250, 261, 264)

  const classes = useStyles();
  //handles change for edit owner name dropdown(line 232)
  const handleChange = (event) => {
    setOwnerName(event.target.value);
  };
//handles change for edit imageURL(line 218)
  const handleImageChange = (event) => {
    setImage(event.target.value);
  }
  const handleCatNameChange = (event) => {//handles change for cat name(line 219)
    setCatName(event.target.value);
  }
//handles change for search(line 158)
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  }
//handles change for edit birthday(line 220)
  const handleBirthdayChange = (event) => {
    setBirthday(event.target.value);
  }
//Updates info to data array containing all cats
//Input state: object of current cat selected to update(line 243)
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
//handles onClick for search button
//Input search: string of current search bar entry(line 159)
  const searchButtonClick = (search) => {
    for(let i = 0; i <= data.length; i++){
      if(search === data[i].name){
        setState(data[i]);
      }
    }
  }

 return (
   <div className={classes.root}>
     {/* Top of drawer*/}
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
       {/* Search Bar and Button */}
       <Box>
       <TextField id="filled-basic"   placeholder={'Search'} onChange={handleSearchChange}></TextField>
       <IconButton onClick={()=> {searchButtonClick(search)}}>
        <SearchIcon fontSize={'small'}/>
       </IconButton>
      </Box>
      {/* List of cats in data array */}
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
     {/* Display current selected cat and delete/edit buttons */}
     <Box sx={centerView}>
     <img src={state.thumbnail_url} className={classes.photo} alt=' '/>
     <Box >
     <Typography display="block">Name: {state.name}</Typography>
     <Typography display="block">Birthday: {state.birthdate}</Typography>
     <Typography display="block">Owner: {state.owner_name}</Typography>
     <Typography display="block">Number of Views: {state.views_count + 1}</Typography>
      <Button variant='contained' color='primary' onClick={handleOpen}>EDIT</Button>
      <Button variant='contained' color='secondary' onClick={handleDeleteOpen}>DELETE</Button>
     </Box>
     </Box>
      {/* Edit cat modal */}
    <div>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Cat
          </Typography>
        {/* inputs for edit cat modal */}
        <TextField id="filled-basic" label="Image URL" variant="filled" defaultValue={state.thumbnail_url} onChange={handleImageChange}></TextField>
        <TextField id="filled-basic" label="Cat Name" variant="filled" defaultValue={state.name} onChange={handleCatNameChange}></TextField>
        <TextField id="filled-basic" label="Birth date" variant="filled" defaultValue={state.birthdate} onChange={handleBirthdayChange}></TextField>
        <Box
          component="form"
          sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}}
          noValidate
          autoComplete="off"
        >
        {/* select owner dropdown */}
        <TextField
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
        {/* save/cancel buttons for edit cat modal */}
        <Button onClick={() => {updateInfo(state); handleClose()}}> Save </Button>
        <Button onClick={handleClose}> Cancel </Button>
        </Box> 
      </Modal>
      {/* Delete Cat confirmation modal */}
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

