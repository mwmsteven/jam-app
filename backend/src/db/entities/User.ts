import { relativeTimeThreshold } from "moment";
import {Entity, BaseEntity, Column, ManyToOne, JoinColumn, PrimaryColumn} from "typeorm";
import Roles from '../../types/Roles.json';
import Team from "./Team";

@Entity() // ORM Entity
export default class User extends BaseEntity {
    @PrimaryColumn()
    id: string    

    @Column({unique: true})
    email: string;

    @Column({nullable: true})
    firstName: string;

    @Column({nullable: true})
    lastName: string;

    @Column("simple-array", {nullable: true})
    roles: string[];

    @ManyToOne(()=>Team)
    @JoinColumn()
    team: Team;

    public calculateRoles(): string[]{
        var roles = this.roles;
        for(var id in Roles){
            if (Roles[id].default && !roles.includes(id)) roles.push(id);
        }
        return roles;
    }

    public hasRole(role: string){
        return this.calculateRoles().includes(role);
    }

    public hasRoles(roles: string[], and: boolean = true){
        var count = 0;
        for(var role of this.calculateRoles()){
            for(var testrole of roles){
                if (role == testrole) {
                    if (and) count++;
                    else return true;
                }
            }
        }
        return and && count == roles.length;
    }
}