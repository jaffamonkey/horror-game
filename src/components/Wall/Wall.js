require('components/obj/obj.css');
require('components/wall/wall.css');

import React from 'react';
import Plain from '../plain/Plain';

export default ({ pos, size, angle = [0, 0, 0], getTransformRule }) => {
    const transformRule = getTransformRule({ pos, angle });
    // Front-Back-Left-Right-Top-Bottom
    return <div className="obj wall" style={transformRule}>
        <Plain pos={[0, -size[1] / 2, size[2] / 2]} size={size} angle={[0, 0, 0]} getTransformRule={getTransformRule}/>
        <Plain pos={[0, -size[1] / 2, -size[2] / 2]} size={size} angle={[0, 0, 0]} getTransformRule={getTransformRule}/>
        <Plain pos={[-size[0] / 2, -size[1] / 2, 0]} size={[size[2], size[1]]} angle={[0, 90, 0]} getTransformRule={getTransformRule}/>
        <Plain pos={[size[0] / 2, -size[1] / 2, 0]} size={[size[2], size[1]]} angle={[0, -90, 0]} getTransformRule={getTransformRule}/>
        <Plain pos={[0, -size[1], 0]} size={[size[0], size[2]]} angle={[90, 0, 0]} getTransformRule={getTransformRule}/>
        <Plain pos={[0, 0, 0]} size={[size[0], size[2]]} angle={[-90, 0, 0]} getTransformRule={getTransformRule}/>
    </div>;
}
