let timeout = 0;
let cube = null;

AFRAME.registerComponent("follow", {
  init: function () {
    let el = this.el;
    this.velocity = 0;
    this.target = document.querySelector("#ayam");
    cube = document.createElement("a-sphere");
    cube.setAttribute("color", "cyan");
    cube.setAttribute("opacity", "0.1");
    cube.setAttribute("scale", "0.1 0.1 0.1");
    let scene = document.querySelector("a-scene");
    scene.appendChild(cube);

    this.el.sceneEl.addEventListener("onFollow", function (e) {
      cube.setAttribute("position", `${e.detail.x} ${0} ${e.detail.z}`);
      let position = cube.object3D.position;
      el.object3D.lookAt(new THREE.Vector3(position.x, 0, position.z));

      if (timeout) {
        clearTimeout(timeout);
      }

      let dur = 1200;
      console.log(el.object3D);
      let animationProperties = {
        property: "position",
        to: {
          x: e.detail.x,
          y: 0,
          z: e.detail.z,
        },
        dur,
        easing: "linear",
      };
      el.setAttribute("animation", animationProperties);
      el.setAttribute("animation-mixer", `clip: zapdos_run`);

      timeout = setTimeout(() => {
        el.setAttribute("animation-mixer", `clip: zapdos_idle;`);
        clearTimeout(timeout);
      }, dur);
    });
  },
});

AFRAME.registerComponent("cursor-listener", {
  init: function () {
    let el = this.el;
    this.el.addEventListener("click", function (evt) {
      console.log("I was clicked at: ", evt.detail.intersection);

      var position = new THREE.Vector3(
        evt.detail.intersection.point.x,
        0,
        evt.detail.intersection.point.z
      );

      el.emit("onFollow", {
        pointer: evt.detail.intersection.object,
        distance: evt.detail.distance,
        x: evt.detail.intersection.point.x,
        y: evt.detail.intersection.uv.y,
        z: evt.detail.intersection.point.z,
        point: evt.detail.intersection.point,
      });
    });
  },
});
