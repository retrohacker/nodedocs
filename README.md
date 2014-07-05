nodedocs
===

`nodedocs` is *THE* documentation tool for node.js. Starting from your current working directory, `nodedocs` will scan your _node\_modules_ directory for project _README.md_ files. It will build a nice little tree of your dependency list, with all of the READMEs served up on localhost!

# Why does this exist?

Many languages have clunky auto-documenting tools that serve up local documentation. There is JavaDoc, godoc, etc. These rely on you to document function calls inline. This is dumb. Why do I, as a consumer of your tool, care about its implementation? Documenting function calls accomplishes nothing, and fails to give you the larger picture of what the module is designed to do.

## Node got it right

Incubated in the github ecosystem, nearly every project has a proper _README.md_. To make this scenario even more awesome, npm hosts up this fantastic readme in the package manager. Nodes culture of decoupling documentation from code is fantastic.

## Cool, so READMEs, but why `nodedocs`?

I'm glad you asked. So the project you maintain uses an old version of hapi. You go out to npmjs.org or github.com to view it's documentation. Not surprisingly, this project has a fantastic _README.md_ file (it is node). You use this documentation, and your code throws up errors everywhere. Why? Hapi's api has changed, thus the doucmentation you are looking at online is different then the api for the module you have installed.

*But wait!*

It gets worse. You are working on an awesome project in an airport terminal. You `npm install --save gfm2html` and immediately the come over the intercom saying it is time to board the plane. You get on the plane and immediately realize you didn't open github to view gfm2html's documentation... Wait! nodedocs to the rescue! Instead of paying $400 for 15 minutes of internet through American Airlines, simply type `nodedocs` for the low low price of free!

# Usage

`nodedocs`

Output

```text
Building docs...
Done!
Staring server on 0.0.0.0:8080
```

You can now open your webbrowser and head on over to `127.0.0.1:8080` and you will see all the documentation for packages installed in your cwd!


# How to make a dirty martini

```text
- 1 shotglass of Dry Vermouth
- 2 shotglasses of Gin
- 1 olive
- 1 tablespoon of olive juice
- 1 shaker
- As much ice as can fit in the shaker
Mix olive juice, gin, and vermouth in the shaker. Strain into martini glass.
Kick back and enjoy your locally served node documentation.
```
