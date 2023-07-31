import { Box, Tabs, Tab } from '@mui/material';
import { useState, ReactNode } from "react";

interface tabPanelProps {
    children: ReactNode;
    value: number;
    index: number;
    [prop: string]: any;
}

function TabPanel(props : tabPanelProps) {
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
          <Box sx={{ p: 1 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }

function a11yProps(index: number) {
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

type tabPanels = {
    name: string;
    contents: ReactNode;
    key: string;
}[];

interface basicTabsProps {
    tabs: tabPanels;
}

export default function BasicTabs( {tabs} : basicTabsProps ) {
    const [value, setValue] = useState(0);
  
    const handleChange : (event: React.SyntheticEvent, value: any) => void = (_, newValue) => {
      setValue(newValue);
    };
  
    return (
      <Box >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            {tabs.map((tab, index) => <Tab label={tab.name} {...a11yProps(index)} key={tab.key}/>)}
          </Tabs>
        </Box>
        {tabs.map((tab, index) => <TabPanel value={value} index={index} key={tab.key}>{tab.contents}</TabPanel>)}
      </Box>
    );
}