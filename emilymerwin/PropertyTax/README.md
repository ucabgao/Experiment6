#Property Tax Series
 - This is an annual series that compares property tax assessments with actual home sale prices, for the Atlanta metro counties. When we started the series assessments were coming in way above sale prices, but in response to our reporting a new law was passed that prevented recently sold properties from being assessed above the sale price, which helped bring assessments back in line with actual values. It appears that in 2012 home prices have gained enough ground that they are now beating assessments.
 - <a href="http://www.ajc.com/propertytax2012/" target="_blank">2012 version</a> <a href="http://www.myajc.com/propertytax2013/" target="_blank">2013 version</a>
 
##Setup
- Reporter should send XLS or CSV file with county, number of sales (1st quarter), gap value (difference between appraisals and sale prices) and median sale price
	- Price will be in string dollar format, but that's fine since we are only operating on the GAP field
	- GAP might have % sign, if so change cell format to Number. Parser will convert it to whole number
- proptaxCSVtoXML.py will generate an XML file from the CSV
- Send the script-styled SVG to print - to get the new SVG, view the application online, download the page, copy the SVG section and paste it into a fresh file. Save as .svg

###ToDo
- handle missing ZIPs
- Use JSON instead of XML
