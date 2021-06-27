import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Modal from '@material-ui/core/Modal';
import Carousel from 'react-material-ui-carousel'
import CarouselSlide from 'react-material-ui-carousel';
import CircularProgress from '@material-ui/core/CircularProgress';
import no_image from './no_image.png';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    height: "100%",
  },
  gridList: {
    width: "90%",
    height: "90%",
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  paper: {
    position: 'absolute',
    width: 500,
    backgroundColor: 'transparent',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function rand() {
    return Math.round(Math.random() * 20) - 10;
}
  
function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

export default function TitlebarGridList() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [imageList, setImageList] = React.useState([]);
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(()=> {
      fetch("https://www.westelm.com/services/catalog/v4/category/shop/new/all-new/index.json")
      .then(response => {
          if (response.ok) {
              return response.json()
          }
          throw response
      })
      .then(data=> {
        setData(data)
      })
      .catch(error=> console.log("Error while fetching data from url: ", error))
      .finally(()=>setIsLoading(false))
  },[])

  const handleToggle = (index) => {
    let groupData = data.groups
    let imageData = groupData[index].images
    if (imageData.length > 0) {
        setImageList([...imageData]);
        setOpen(!open);
    } else {
        alert("No images found")
    }
  };

  return (
    <div className={classes.root} style={{justifyContent:'center', alignItems:'center'}}>
    {
        isLoading ? <CircularProgress disableShrink /> :
        <GridList cellHeight={300} cols={3} className={classes.gridList}>
            <GridListTile key="Subheader" cols={3} style={{ height: 'auto' }}>
                <ListSubheader component="div">Williams-Sonoma</ListSubheader>
            </GridListTile>
            {data != null && data.groups.map((tile, index) => (
                <GridListTile key={tile.img} key={index}>
                    {
                        tile.hero != null ? 
                        <img src={tile.hero.href} alt={tile.title} onClick={()=> handleToggle(index)}/>:
                        <img src={no_image} alt={tile.title} onClick={()=> handleToggle(index)} />
                    }
                    <GridListTileBar
                    title={tile.name}
                    subtitle={<span> ${tile.price ?  tile.price.regular: tile.priceRange.selling.high }</span>}
                    actionIcon={
                        <IconButton aria-label={`info about ${tile.name}`} className={classes.icon} onClick={()=> window.open(tile.links.www, "_blank")}>
                        <InfoIcon />
                        </IconButton>
                    }
                    />
                </GridListTile>
            ))}
        </GridList>
    }
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <div style={modalStyle} className={classes.paper}>
            <Carousel>
                {imageList.map(({href, rel}) => (
                    <CarouselSlide key={href}>
                        <GridList cols={1}>
                            <GridListTile key={rel} style={{ height: 500 }}>
                                <img src={href} alt={rel} />
                            </GridListTile>
                        </GridList>
                    </CarouselSlide>
                ))}
            </Carousel>
        </div>
      </Modal>
    </div>
  );
}
