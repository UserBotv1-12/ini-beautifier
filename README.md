# ini-beautifier
An INI file beautifier.  

# what is an INI file?
INI files are simple text files with a basic structure composed of sections, key (or property), and values. https://en.wikipedia.org/wiki/INI_file

## Keys (properties)
The basic element contained in an INI file is the key or property. Every key has a name and a value, delimited by an equals sign (=). The name appears to the left of the equals sign.
```
name=value
```

## Sections
Keys may (but need not) be grouped into arbitrarily named sections. The section name appears on a line by itself, in square brackets ([ and ]). All keys after the section declaration are associated with that section. There is no explicit "end of section" delimiter; sections end at the next section declaration, or the end of the file. Sections may not be nested.
```
[section]
a=a
b=b
```

## Case insensitivity
Section and property names are not case sensitive in the Windows implementation.

## Comments
Semicolons (;) at the beginning of the line indicate a comment. Comment lines are ignored.
```
;
; comment text
; 
```

# options
### Blank lines
Some rudimentary programs do not allow blank lines. Every line must therefore be a section head, a property, or a comment. You can control this with `noblanks: true`. The default value is 'false'.

### Comments
In some implementations, a comment may begin anywhere on a line, including on the same line after properties or section declarations. In others, including the WinAPI function GetPrivateProfileString, comments must occur on lines by themselves. You may control this with `inlinecomments = true` - default is 'false' and will move them to a new line if present.

### Name/value delimiter
Some implementations allow a colon `:` as the name/value delimiter instead of `=`. Equals sign is the default. Control with `delimiter: ':'`

### Quoted values
Some implementations allow values to be quoted, typically using double quotes and/or apostrophes. This allows for explicit declaration of whitespace, and/or for quoting of special characters (equals, semicolon, etc.). The standard Windows function GetPrivateProfileString supports this, and will remove quotation marks that surround the values. Control with `quotedvalues: 'on'` - default is 'off' and will remove them if present.

### Whitespace
Interpretation of whitespace varies. Most implementations ignore leading and trailing whitespace around the outside of the property name. Some even ignore whitespace within values (for example, making "host name" and "hostname" equivalent). Some implementations also ignore leading and trailing whitespace around the property value; others consider all characters following the equals sign (including whitespace) to be part of the value. Control with `removewhitespace: false` - default is 'true' and will remove any if present.


### Example
Following is an example INI file for an imaginary program. It has two sections: one for the owner of the software, and one for a payroll database connection. Comments note who modified the file last and why an IP address is used instead of a DNS name.
```
; last modified 1 April 2001 by John Doe
[owner]
name=John Doe
organization=Acme Widgets Inc.

[database]
; use IP address in case network name resolution is not working
server=192.0.2.62     
port=143
file="payroll.dat"
```

## How to Use
```
npm install
```
put your .txt files into input directory, then double click the start.bat,  
wait a moment, the result file will be find in output directory.  

 -- From Chinese --
Txt file you put in the input folder and then double-clicking the start.bat file, slightly later, after files have been processed in the output folder.  


What program do? It's really quite simple, retain reasonable line breaks, remove the extra line breaks. 

How to determine if a line is redundant (or unreasonable)? If newline symbol in front, not a period. " "The symbolic end, Basic you can tell the line is redundant, of course, I also dealt with something more detailed, more simple.  

After beautification of text, open your reader, you will have better typography.  

If there is a bug, please let me know, thank you.  

Thanks to open source programs in the industry.
