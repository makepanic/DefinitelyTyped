import DS from 'ember-data';
import { assertType } from './lib/assert';

declare const store: DS.Store;

class Folder extends DS.Model {
    name = DS.attr('string');
    children = DS.hasMany('folder', { inverse: 'parent' });
    parent = DS.belongsTo('folder', { inverse: 'children' });

    @DS.belongsTo('owner') owner!: Owner;
}

class Owner extends DS.Model {
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        folder: Folder;
        owner: Owner;
    }
}

const folder = Folder.create();
assertType<Folder>(folder.get('parent'));
assertType<string>(folder.get('parent').get('name'));
folder.get('parent').then(parent => {
    assertType<Folder>(parent);
    assertType<string>(parent.get('name'));
    folder.set('parent', parent);
});

folder.set('parent', folder);
folder.set('parent', folder.get('parent'));
folder.set('parent', store.findRecord('folder', 3));

// when used as cp
// $ExpectType Folder | null
folder.belongsTo('parent').value();

// when used as decorator
// $ExpectType Owner | null
folder.belongsTo('owner').value();

// $ExpectType "id" | "link"
folder.belongsTo('parent').remoteType();
