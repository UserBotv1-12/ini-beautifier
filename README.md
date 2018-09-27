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
; comment text has no bearing on keys or values
; 
```
# options today
Today, the beautifier is very opinionated.  You *cannot* set options to alter behavior.  Currently, it
* uppercases the key (`KEY=value`)
* lowercases the section name (`[section]`)
* removes whitespace around the `=`
* removes all blank lines

# future options
Notice - these are features I want to implement but are not yet ready.

### Blank lines
TODO: Some rudimentary programs do not allow blank lines. Every line must therefore be a section head, a property, or a comment. You can control this with `noblanks: true`. The default value is 'true'.

### Comments
TODO: In some implementations, a comment may begin anywhere on a line, including on the same line after properties or section declarations. In others, including the WinAPI function GetPrivateProfileString, comments must occur on lines by themselves. You may control this with `inlinecomments = true` - default is 'false' and will move them to a new line if present.

### Name/value delimiter
TODO: Some implementations allow a colon `:` as the name/value delimiter instead of `=`. Equals sign is the default. Control with `delimiter: ':'`

### Quoted values
TODO: Some implementations allow values to be quoted, typically using double quotes and/or apostrophes. This allows for explicit declaration of whitespace, and/or for quoting of special characters (equals, semicolon, etc.). The standard Windows function GetPrivateProfileString supports this, and will remove quotation marks that surround the values. Control with `quotedvalues: 'on'` - default is 'off' and will remove them if present.

### Whitespace
TODO: Interpretation of whitespace varies. Most implementations ignore leading and trailing whitespace around the outside of the property name. Some even ignore whitespace within values (for example, making "host name" and "hostname" equivalent). Some implementations also ignore leading and trailing whitespace around the property value; others consider all characters following the equals sign (including whitespace) to be part of the value. Control with `removewhitespace: false` - default is 'true' and will remove any if present.

### Key Casing
TODO: Key (or properties) can be cased to your specifications.  The valid options are `title`, `caps`, `lower`, `nochange`.  `caps` is the default: `keycasing: 'nochange'`. `title` casing will locate `_` underscores and change the case of the next character.

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
put your .txt or .ini files into `/input` directory, then `node src/index.js`, wait a moment, the corresponding beautified file will be found in `/output` directory.  
