//      JavaScript      //


window.onload = function () {
  const modelEntity = document.querySelector('[gltf-model="#model2-1"]');

  if (!modelEntity) {
      console.error("❌ GLTF მოდელი #model2-1 ვერ მოიძებნა!");
      return;
  }

  modelEntity.addEventListener('model-loaded', function (e) {
      console.log("✅ მოდელი #model2-1 ჩაიტვირთა!", e.detail.model);

      let mixer = new THREE.AnimationMixer(e.detail.model);
      let action = mixer.clipAction(e.detail.model.animations[0]); // იღებს პირველ ანიმაციას

      action.play(); // ⏯️ ანიმაციის გაშვება
      console.log("🎬 ანიმაცია დაიწყო!!!");

      // დააყენე ანიმაციის სიჩქარე, მაგალითად 2-ს
      action.timeScale = 2; // ანიმაციის სიჩქარე 2x

      function animate() {
          requestAnimationFrame(animate);
          mixer.update(0.016); // 60 FPS (1/60 = 0.016)
      }
      animate();

      let model = e.detail.model; // სამგანზომილებიანი ობიექტი
      
      // მოძებნოს ყველა მატერიალი სახელით
      model.traverse((node) => {
        if (node.isMesh) {
            let materialName = node.material.name;
            
            if (materialName === "Material" || materialName === "Material.001") {
                console.log(`🎨 მოიძებნა მატერიალი: ${materialName}`, node.material);
                
                // მივანიჭოთ პარამეტრებიიიიი
                node.material.metalness = 0.5;
                node.material.roughness = 0.5;

                // გავააქტიუროთ ცვლილებებიიიი
                node.material.needsUpdate = true;
            }
        }
      });
  });
};

const camera = document.querySelector('[camera]');


// Get all 15 markers
const markers = [];
const entModels = [];
    
for (let i = 1; i <= 15; i++) {
  markers.push(document.getElementById(`marker${i}`));
  entModels.push(document.getElementById(`entmodel${i}`));
}

let mainmarker = markers[0];

// const marker1 = document.getElementById("marker1");
// const marker2 = document.getElementById("marker2");
// const marker3 = document.getElementById("marker3");
// let mainmarker = marker1;

// const entModel1 = document.getElementById("entmodel1");
// const entModel2 = document.getElementById("entmodel2");
// const entModel3 = document.getElementById("entmodel3");

const entMarker = document.getElementById("entmarker1");


let entMarkerAdded = false;
let stabilizeInterval;
let isNFTVisible = false;
let howManyNFTVisible = 0;
let isMemoryMode = true;

const cameraPos = new THREE.Vector3(0, 0, 0);

function stabilizeModel() {
  if (isMemoryMode) {
    const markerPosition = mainmarker.object3D.position;
    const distanceToMarker = cameraPos.distanceTo(markerPosition);

    if (Math.abs(distanceToMarker - entMarker.object3D.position.z) > 30) {
      entMarker.object3D.position.set(0, 0, 0 - distanceToMarker);
    } else {
    }
  }
}

function stabilizeRotation() {
  if (isMemoryMode) {
    const markerRotation = mainmarker.object3D.rotation;
    const entMarkerRotation = entMarker.object3D.rotation;

    const markerRotX = THREE.MathUtils.radToDeg(markerRotation.x);
    const markerRotY = THREE.MathUtils.radToDeg(markerRotation.y);
    const markerRotZ = THREE.MathUtils.radToDeg(markerRotation.z);

    const entMarkerRotX = THREE.MathUtils.radToDeg(entMarkerRotation.x);
    const entMarkerRotY = THREE.MathUtils.radToDeg(entMarkerRotation.y);
    const entMarkerRotZ = THREE.MathUtils.radToDeg(entMarkerRotation.z);

    if (Math.abs(markerRotX - entMarkerRotX) > 5) {
      entMarkerRotation.x = markerRotation.x;
    }
    if (Math.abs(markerRotY - entMarkerRotY) > 5) {
      entMarkerRotation.y = markerRotation.y;
    }
    if (Math.abs(markerRotZ - entMarkerRotZ) > 5) {
      entMarkerRotation.z = markerRotation.z;
    }
  }
}

function updateMainMarker() {
  if (isMemoryMode) {
    // const markers = [marker1, marker2, marker3];
    const visibleMarkers = [];

    for (let i = 0; i < markers.length; i++) {
      if (markers[i].getAttribute("visible")) {
        visibleMarkers.push(markers[i]);
      }
    }

    if (visibleMarkers.length === 0) return;

    const screenCenter = new THREE.Vector3(0, 0, -100).sub(cameraPos).normalize();
    let bestMarker = visibleMarkers[0];
    let maxAngle = -Infinity;

    let bestMarkerindex = 0;

    for (let i = 0; i < visibleMarkers.length; i++) {
      const markerPos = new THREE.Vector3();
      visibleMarkers[i].object3D.getWorldPosition(markerPos);
      const toMarker = markerPos.clone().sub(cameraPos).normalize();
      const angle = screenCenter.dot(toMarker);

      if (angle > maxAngle) {
        maxAngle = angle;
        bestMarker = visibleMarkers[i];
        bestMarkerindex = i;
      }
    }

    mainmarker = bestMarker;
    // entModel1.setAttribute("visible", mainmarker.getAttribute("id") === marker1.getAttribute("id"));
    // entModel2.setAttribute("visible", mainmarker.getAttribute("id") === marker2.getAttribute("id"));
    // entModel3.setAttribute("visible", mainmarker.getAttribute("id") === marker3.getAttribute("id"));

    for (let i = 0; i < markers.length; i++) {
      entModels[i].setAttribute("visible", mainmarker.getAttribute("id") === markers[i].getAttribute("id"));
    }
  }
}

let memoryButton = document.getElementById("memory-button");

memoryButton.addEventListener("click", () => {
  isMemoryMode = !isMemoryMode;

  if (isMemoryMode) {
    memoryButton.classList.remove("deactive-button");
    memoryButton.classList.add("active-button");
    entMarker.setAttribute("visible", howManyNFTVisible > 0);
    // console.log("Memory mode activated!");
  } else {
    memoryButton.classList.remove("active-button");
    memoryButton.classList.add("deactive-button");
    // console.log("Memory mode deactivated");
  }
});

// console.log(`NFT is ${isNFTVisible ? "Visible" : "Not Visible"}`);

/* global AFRAME, THREE */

AFRAME.registerComponent("gesture-handler", {
  schema: {
    enabled: { default: true },
    rotationFactor: { default: 5 },
    minScale: { default: 0.1 },
    maxScale: { default: 10 },
  },

  init: function () {
    this.handleScale = this.handleScale.bind(this);
    this.handleRotation = this.handleRotation.bind(this);

    this.isVisible = false;
    this.initialScale = this.el.object3D.scale.clone();
    this.scaleFactor = 1;

    this.el.sceneEl.addEventListener("markerFound", (e) => {
      // "markerFound"-ში მარტო "this.isVisible = true;" და მე შევცვალე

      console.log("funqcia markerFound --- ");
      howManyNFTVisible++;
      stabilizeInterval = setInterval(() => {
        if (isMemoryMode) {
          updateMainMarker();
          stabilizeModel();
          stabilizeRotation();
        }
      }, 25);

      if (isMemoryMode) {
        this.isVisible = true;
        const markerPosition = mainmarker.object3D.position;
        const markerRotation = mainmarker.object3D.rotation;
        entMarker.object3D.position.set(
          markerPosition.x,
          markerPosition.y,
          markerPosition.z
        );
        entMarker.object3D.rotation.set(
          markerRotation.x,
          markerRotation.y,
          markerRotation.z
        );
        entMarker.setAttribute("visible", true);
        entMarkerAdded = true;
      }

      isNFTVisible = true;
      console.log("NFT Marker Found");
    });

    this.el.sceneEl.addEventListener("markerLost", (e) => {
      // "markerFound"-ში მარტო "this.isVisible = false;" და მე შევცვალე
      
      console.log("funqcia markerLost --- ");
      if (isMemoryMode) {
        this.isVisible = false;
      }

      howManyNFTVisible--;

      // if (window.isMemoryMode) {
      //   this.setAttribute('visible', false);
      // }

      if (howManyNFTVisible === 0) {
        clearInterval(stabilizeInterval);
        if (isMemoryMode) {
          entMarkerAdded = false;
          entMarker.setAttribute("visible", false);
          console.log("Marker lost and entMarker hidden.");
        } else {
          console.log(
            "Marker lost but Memory mode is deactive. entMarker remains visible."
          );
        }
        isNFTVisible = false;
        console.log("NFT Marker Lost");
      }
    });
  },

  update: function () {
    if (this.data.enabled) {
      this.el.sceneEl.addEventListener("onefingermove", this.handleRotation);
      this.el.sceneEl.addEventListener("twofingermove", this.handleScale);
    } else {
      this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
      this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
    }
  },

  remove: function () {
    this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
    this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
  },

  // handleRotation: function (event) {
  //   if (this.isVisible || isMemoryMode) {
  //     this.el.object3D.rotation.y += event.detail.positionChange.x * this.data.rotationFactor;
  //     this.el.object3D.rotation.x += event.detail.positionChange.y * this.data.rotationFactor;
  //   }
  // },

  handleRotation: function (event) {
    if (this.isVisible || isMemoryMode) {
  
      let deltaX = event.detail.positionChange.x * this.data.rotationFactor;
      let deltaY = event.detail.positionChange.y * this.data.rotationFactor;
  
      this.el.object3D.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -deltaX); // vertical rotate (on Y Axis)
      this.el.object3D.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), deltaY); // horizontaal rotate (on X Axis)
    }
  },

  handleScale: function (event) {
    if (this.isVisible || isMemoryMode) {
      this.scaleFactor *=
        1 + event.detail.spreadChange / event.detail.startSpread;

      this.scaleFactor = Math.min(
        Math.max(this.scaleFactor, this.data.minScale),
        this.data.maxScale
      );

      this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x;
      this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y;
      this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z;
    }
  },
});

// Component that detects and emits events for touch gestures

AFRAME.registerComponent("gesture-detector", {
  schema: {
    element: { default: "" },
  },

  init: function () {
    this.targetElement =
      this.data.element && document.querySelector(this.data.element);

    if (!this.targetElement) {
      this.targetElement = this.el;
    }

    this.internalState = {
      previousState: null,
    };

    this.emitGestureEvent = this.emitGestureEvent.bind(this);

    this.targetElement.addEventListener("touchstart", this.emitGestureEvent);

    this.targetElement.addEventListener("touchend", this.emitGestureEvent);

    this.targetElement.addEventListener("touchmove", this.emitGestureEvent);
  },

  remove: function () {
    this.targetElement.removeEventListener("touchstart", this.emitGestureEvent);

    this.targetElement.removeEventListener("touchend", this.emitGestureEvent);

    this.targetElement.removeEventListener("touchmove", this.emitGestureEvent);
  },

  emitGestureEvent(event) {
    const currentState = this.getTouchState(event);

    const previousState = this.internalState.previousState;

    const gestureContinues =
      previousState &&
      currentState &&
      currentState.touchCount == previousState.touchCount;

    const gestureEnded = previousState && !gestureContinues;

    const gestureStarted = currentState && !gestureContinues;

    if (gestureEnded) {
      const eventName =
        this.getEventPrefix(previousState.touchCount) + "fingerend";

      this.el.emit(eventName, previousState);

      this.internalState.previousState = null;
    }

    if (gestureStarted) {
      currentState.startTime = performance.now();

      currentState.startPosition = currentState.position;

      currentState.startSpread = currentState.spread;

      const eventName =
        this.getEventPrefix(currentState.touchCount) + "fingerstart";

      this.el.emit(eventName, currentState);

      this.internalState.previousState = currentState;
    }

    if (gestureContinues) {
      const eventDetail = {
        positionChange: {
          x: currentState.position.x - previousState.position.x,

          y: currentState.position.y - previousState.position.y,
        },
      };

      if (currentState.spread) {
        eventDetail.spreadChange = currentState.spread - previousState.spread;
      }

      // Update state with new data

      Object.assign(previousState, currentState);

      // Add state data to event detail

      Object.assign(eventDetail, previousState);

      const eventName =
        this.getEventPrefix(currentState.touchCount) + "fingermove";

      this.el.emit(eventName, eventDetail);
    }
  },

  getTouchState: function (event) {
    if (event.touches.length === 0) {
      return null;
    }

    // Convert event.touches to an array so we can use reduce

    const touchList = [];

    for (let i = 0; i < event.touches.length; i++) {
      touchList.push(event.touches[i]);
    }

    const touchState = {
      touchCount: touchList.length,
    };

    // Calculate center of all current touches

    const centerPositionRawX =
      touchList.reduce((sum, touch) => sum + touch.clientX, 0) /
      touchList.length;

    const centerPositionRawY =
      touchList.reduce((sum, touch) => sum + touch.clientY, 0) /
      touchList.length;

    touchState.positionRaw = { x: centerPositionRawX, y: centerPositionRawY };

    // Scale touch position and spread by average of window dimensions

    const screenScale = 2 / (window.innerWidth + window.innerHeight);

    touchState.position = {
      x: centerPositionRawX * screenScale,
      y: centerPositionRawY * screenScale,
    };

    // Calculate average spread of touches from the center point

    if (touchList.length >= 2) {
      const spread =
        touchList.reduce((sum, touch) => {
          return (
            sum +
            Math.sqrt(
              Math.pow(centerPositionRawX - touch.clientX, 2) +
                Math.pow(centerPositionRawY - touch.clientY, 2)
            )
          );
        }, 0) / touchList.length;

      touchState.spread = spread * screenScale;
    }

    return touchState;
  },

  getEventPrefix(touchCount) {
    const numberNames = ["one", "two", "three", "many"];

    return numberNames[Math.min(touchCount, 4) - 1];
  },
});

