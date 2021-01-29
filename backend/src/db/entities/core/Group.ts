import {Entity, BaseEntity, Column, ManyToOne, JoinColumn} from "typeorm";
import {PrimaryUUIDColumn} from '@app/helpers/defaultAPIGenerators';

@Entity() // ORM Entity
export default class Group extends BaseEntity {
    @PrimaryUUIDColumn()
    id: string    

    @Column({nullable: true})
    name: string;

    @Column("simple-array", {nullable: true})
    permissions: string[];
    
    public calculatePermissions(): string[]{
        var perms = this.permissions;
        for(var id in Permissions){
            if (Permissions[id].default && !perms.includes(id)) perms.push(id);
        }
        return perms;
    }

    public hasPermission(role: string){
        return this.calculatePermissions().includes(role);
    }

    public hasPermissions(perms: string[], requireAll: boolean = true){
        var count = 0;
        for(var role of this.calculatePermissions()){
            for(var testrole of perms){
                if (role == testrole) {
                    if (requireAll) count++;
                    else return true;
                }
            }
        }
        return requireAll && count == perms.length;
    }
}