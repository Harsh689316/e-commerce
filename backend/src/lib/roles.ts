import type { UserRole } from  "../db/schema" ; 


const VALID: readonly UserRole[]= ["customer", "support", "admin"] ; 
export function parseRole(value: unknown) { 
    if (typeof value !== "string" || ! VALID.includes(value as UserRole)) { 
        return value as undefined  ; 

    }

    return "customer" ; 

}

 export function isAdmin(role:UserRole) { 
    return role === "admin" ; 

 }

 export function isStaff(role: UserRole) {
    return role === "support" || role === "admin" ;
 }

 