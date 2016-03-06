Math 126
========

We are rebuilding the University of Washington's online Math 126 course materials out in the open. We have just started. You can see the live course site (corresponding to the `gh-pages` branch of this repository) [here](http://maxlieblich.github.io/math126).

### Written in markdown
The course notes have been (are being!) converted into markdown format. Each numbered folder corresponds to a lecture from the course; the old lecture slides are now markdown documents. Using pandoc, these documents can be convered to a bunch of formats:

  - HTML5
  - HTML5 slideshows
  - LaTeX
  - epub

### Scripted

If you look at the markdown pages, you will see chunks like this:
```
Question
--------

How does it feel to fly along this trefoil path?
<div id="trefoil">
  <img src="media/lecture-1-trefoil.png"></img>
</div>

<script>
(function() {
    var scene = new MathScene("trefoil");
    var trefoilFunc = function(t) {
          var t2, t3;
          t2 = t + t;
          t3 = t2 + t;
          return 41 * Math.cos(t) - 18 * Math.sin(t) - 83 * Math.cos(t2) - 83 * Math.sin(t2) - 11 * Math.cos(t3) + 27 * Math.sin(t3);
        };
    var trefoilPoint = function(t) {
          var kScale, x, y, z;
          kScale = 0.01;
          x = trefoilFunc(t);
          y = trefoilFunc(6.283185 - t);
          z = trefoilFunc(t - 1.828453);
          return new THREE.Vector3(kScale * x, kScale * y, kScale * z);
        };
    var x = function (t) { return trefoilPoint(t).x; }
    var y = function (t) { return trefoilPoint(t).y; }
    var z = function (t) { return trefoilPoint(t).z; }
    var ppath = new ParametricPathModel(x, y, z, [-4, 4], 1.3);
    ppath.embedInScene(scene);
}());
</script>
```
The `<img>` tag holds a static image that might appear in a textbook, static website, ebook, etc. The `<script>` tag holds javascript that adds interactive models to the HTML5-rendered document. If you convert this Markdown to LaTeX, pandoc intelligently ignores the `<script>` and only renders the image into the document.

### Math functions provided

The files `js/MathScene.js`, `js/marchingcubesraw.js`, `js/marchintetrahedraraw.js`, `js/surfacenetsraw/js` (and others to come) give us a library of calculus-friendly **client-side** math functions. This library will grow as we add content and need new functions. (We will also eventually document things!) The latter three are mild modifications of files written by @mikolalysenko to compute isosurfaces. (Basically, we made them blob-friendly for the purpose of using web workers to compute the underyling geometry and keep the intensive calculations off of the main thread.)

All of the 3d rendering uses [Three.js](threejs.org). We will eventually include more documentation about the MathScene and MathModel classes. There is nothing earth-shattering in there.

### Plans

We will continuously add functionality over the next year. In the short term, we plan to:
  
  - make all content epub friendly
  - continue to enlarge the script collection to enable more content creation
  - improve documentation
  - abstract the framework from the content so that it is possible to easily do this with other courses
