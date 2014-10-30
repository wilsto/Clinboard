
exports.buildHierarchy = function (arry, type, callback) {

    var roots = [], children = {}, list = [];

    // find the top level nodes and hash the children based on parent
    for (var i = 0, len = arry.length; i < len; ++i) {
        var item = arry[i],
            p = item.parentId,
            target = !p ? roots : (children[p] || (children[p] = []));
        item.longname = item.name;
        target.push({ value: item });
    }

    // function to recursively build the tree
    var findChildren = function(parent,longname) {
        if (children[parent.value._id]) {
            parent.children = children[parent.value._id];
            for (var i = 0, len = parent.children.length; i < len; ++i) {
                parent.children[i].value.longname = parent.value.longname+'.'+parent.children[i].value.name;
                list.push({name:parent.children[i].value.longname,id:parent.children[i].value._id});
                findChildren(parent.children[i],parent.value.longname);
            }
        }
    };

    // enumerate through to handle the case where there are multiple roots
    for (var i = 0, len = roots.length; i < len; ++i) {
        list.push({name:roots[i].value.longname,id:roots[i].value._id});
        findChildren(roots[i]);
    }

    if (type='list') {return list};
    if (type='Treeview') {return roots};

    //do stuff
    callback();
        
};