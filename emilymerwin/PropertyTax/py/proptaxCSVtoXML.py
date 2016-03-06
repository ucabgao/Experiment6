#! /usr/bin/env python
import csv
import decimal
from xml.dom.minidom import Document

data = csv.DictReader (open("../data/zips2013.csv",'U'))
#Create the XML doc
doc = Document()
#create the base element
docbase = doc.createElement("docbase")
doc.appendChild(docbase)

def gapFixer(n):
    if "NA" == n:
        return n
    else:
        dec = int(round(decimal.Decimal(n), 2)*100)
        return str(dec)

for row in data:
    #create the row element
	ZIP = doc.createElement('ZIP')

	ZIP.setAttribute('COUNTY', row['County'].strip())
	ZIP.setAttribute('ZIP_CODE', row['ZIP'].strip())
	ZIP.setAttribute('GAP', gapFixer(row['GAP']))
	ZIP.setAttribute('PRICE', row['MEDIAN SALE PRICE'])
	ZIP.setAttribute('SALES', row['1ST QUARTER SALES'])
	docbase.appendChild(ZIP)

f = open('../data/zips2013.xml', 'w')
doc.writexml(f, addindent=" ", newl="\n")
f.close()