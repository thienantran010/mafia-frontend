import { Box, Tabs, Tab, Typography } from '@mui/material';
import { useState } from "react";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

// tabs should be a list of objects
// each object has the following fields:
/* 
{
    name: string,
    contents: component
    key: string
}

*/
export default function BasicTabs( {tabs} ) {
    const [value, setValue] = useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            {tabs.map((tab, index) => <Tab label={tab.name} {...a11yProps(index)} key={tab.key}/>)}
          </Tabs>
        </Box>
        {tabs.map((tab, index) => <TabPanel value={value} index={index} key={tab.key}>{tab.contents}</TabPanel>)}
      </Box>
    );
}