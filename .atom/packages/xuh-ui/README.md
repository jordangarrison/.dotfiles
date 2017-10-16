# xuh UI Theme

---

A UI theme for Atom, inspired by artist [xuh](http://gimb.tumblr.com/) (no permission asked or granted).

![Screenshot](https://raw.githubusercontent.com/louisdeb/xuh-ui/master/screenshot.png)

The syntax theme I have used here is Duotone Light with
- Uno: hsb(359, 0%, 0%) (a.k.a black)
- Duo: hsb(47, 93%, 92%)

I used Duotone Light to quickly create a suitable syntax theme for xuh-ui. I would like to create a xuh-syntax theme eventually.

I use the [tree-view-background](https://atom.io/packages/tree-view-background) package to add some of xuh's art to my tree view. I edited the styles of the package to better suit my theme. If you want to copy this go to `user/.atom/packages/tree-view-background/styles/` and edit `background.less`. My `background.less` looks like this:

```
.tree-view {
  background: transparent !important;
}

.tree-view-background {
  content: "";
  background-repeat: no-repeat;
  background-position: right bottom;
  background-size: 180px;
  margin-bottom: -10px;
  margin-right: -20px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
  position: absolute;
}
```

Which is actually horribly hacky, negative margins and all. I wanted to include the tree-view image in the theme itself, and since I could not [work out](https://discuss.atom.io/t/adding-a-background-image-to-tree-view/39596) how to do so, created a quick solution using this package. If I work out how to add the image using Atom UI themes only, I will create a nice solution.
