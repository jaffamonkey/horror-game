require('./index.css');

import { FPS, KEY_W, KEY_S, KEY_A, KEY_D, KEY_SHIFT, STEP, RUNNING_COEFF } from './constants';

import React from 'react';
import ReactDOM from 'react-dom';
import * as redux from 'redux';
import { Provider } from 'react-redux'
import { batchActions, enableBatching } from 'redux-batched-actions';

import Controls from './lib/Controls';
import Loop from './lib/Loop';
import Camera from './containers/Camera';
import reducers from './reducers';

const store = redux.createStore(enableBatching(reducers));

const viewportNode = document.getElementById('viewport');
var controls = new Controls({
    pointerLockerNode: viewportNode
});

new Loop(frameRateCoefficient => {
    const actions = [];
    const pointerDelta = controls.getPointerDelta();
    if (pointerDelta.x || pointerDelta.y) {
        actions.push({
            type: 'updateViewAngle',
            pointerDelta
        });
    }

    let angleShift = [];
    if (controls.keyPressed[KEY_W]) {
        angleShift.push(Math.PI);
    }
    if (controls.keyPressed[KEY_S]) {
        angleShift.push(0);
    }
    if (controls.keyPressed[KEY_A]) {
        angleShift.push(Math.PI / 2);
    }
    if (controls.keyPressed[KEY_D]) {
        // hack for angles sum
        if (controls.keyPressed[KEY_W]) {
            angleShift.push(3 * Math.PI / 2);
        } else {
            angleShift.push(-Math.PI / 2);
        }
    }

    if (
        controls.keyPressed[KEY_W] ||
        controls.keyPressed[KEY_S] ||
        controls.keyPressed[KEY_A] ||
        controls.keyPressed[KEY_D]
    ) {
        if (controls.keyPressed[KEY_SHIFT]) {
            actions.push({ type: 'playerStateRun' });
        } else {
            actions.push({ type: 'playerStateWalk' });
        }
    } else {
        actions.push({ type: 'playerStateStop' });
    }

    if (angleShift.length) {
        let reducedAngleShift = 0;
        for (let i = 0; i < angleShift.length; i++) {
            reducedAngleShift += angleShift[i];
        }
        reducedAngleShift /= angleShift.length;

        // convert to radians and add
        reducedAngleShift += store.getState().viewAngle[0] * Math.PI / 180;

        let step = frameRateCoefficient * (controls.keyPressed[KEY_SHIFT] ? RUNNING_COEFF : 1) * STEP;
        actions.push({
            type: 'updatePlayerPos',
            shift: [-step * Math.sin(reducedAngleShift), 0, step * Math.cos(reducedAngleShift)]
        });
    }
    if (actions.length) {
        store.dispatch(batchActions(actions));
    }
}, FPS, true);

ReactDOM.render(<Provider store={store}><Camera/></Provider>, viewportNode);
