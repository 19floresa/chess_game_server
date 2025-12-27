import type { gameState } from "../types/state.ts"

class node
{
    #left: node | null
    #right: node | null
    #key: number
    #value: gameState

    constructor(key: number, value: gameState, left: node | null = null, 
                                               right: node | null = null)
    {
        this.#left = left
        this.#right = right
        this.#key = key
        this.#value = value
    }

    #create(key: number, value: gameState, left: node | null = null, 
                                           right: node | null = null)
    {
        return new node(key, value, left, right)
    }

    search(key: number): node | null
    {
        const { child } = this.#findNode(key)
        return child
    }

    add(key: number, value: gameState): boolean
    {
        const { parent, child } = this.#findNode(key)
        if (parent !== null && child === null)
        {
            const lastComparison = key - parent.getKey()
            const nodeNew = this.#create(key, value)
            lastComparison <= 0 ? parent.setLeft(nodeNew) : parent.setRight(nodeNew)
            return true
        }
        return false
    }

    delete(key: number): node | null
    {
        let newRoot: node | null = this
        // Find node to remove
        const { parent, child } = this.#findNode(key)
        if (parent === null && child !== null)
        {
            const { successor } = child.#extractSuccessor()   
            //console.log(`current: ${successor.getKey()}`)
            if (successor !== null)
            {
                // Check if successor is the immediate child of the node to be deleted
                // so it is not readded into the bst.
                const successorKey: number = successor.getKey()
                const childLeft: node | null = child.getLeft()
                const childRight: node | null = child.getRight()
                if (successorKey !== childLeft?.getKey())
                {
                    //console.log(`left: ${childLeft.getKey()}`)
                    successor.setLeft(childLeft)
                }
                
                if (successorKey !== childRight?.getKey())
                {
                    //console.log(`right: ${childRight.getKey()}`)
                    successor.setRight(childRight)
                }
            }

            newRoot = successor

            // Delete Child: Implicitily remove child since node tree wont have access to it anymore
        }
        else if (parent !== null && child !== null)
        {
            const { successor } = child.#extractSuccessor()
            if (successor !== null)
            {
                // Check if successor is the immediate child of the node to be deleted
                // so it is not readded into the bst.
                const successorKey: number = successor.getKey()
                const childLeft: node | null = child.getLeft()
                const childRight: node | null = child.getRight()
                if (successorKey !== childLeft?.getKey())
                {
                    successor.setLeft(child.getLeft())
                }
                
                if (successorKey !== childRight?.getKey())
                {
                    successor.setRight(child.getRight())
                }
            }

            const keyDiff: number = child.getKey() - parent.getKey()
            if (keyDiff <= 0)
            {
                parent.setLeft(successor)
            }
            else
            {
                parent.setRight(successor)
            }

            // Delete Child: Implicitily remove child since node tree wont have access to it anymore
        }
        return newRoot
    }

    inorderTraversal(node: node | null = this): number[]
    {
        if (node !== null)
        {
            const left: number[] = this.inorderTraversal(node.getLeft())
            const right: number[] = this.inorderTraversal(node.getRight())
            return [ node.getKey(), ...left, ...right ]
        }

        return []
    }

    getKey(): number
    {
        return this.#key
    }

    getValue(): gameState
    {
        return this.#value
    }

    getLeft(): node | null
    {
        return this.#left
    }

    getRight(): node | null
    {
        return this.#right
    }

    setLeft(node: node | null): void
    {
        this.#left = node
    }

    setRight(node: node | null): void
    {
        this.#right = node
    }

    /**
     * This function tries to find the node matching the key.
     * 
     * NOTE 1: If the parent is null then a duplicate node was found
     * NOTE 2: If the child is null then a leaf node was found
     * NOtE 3: child is the node matching key
     * @param key  Node to find
     * @returns  Data of the last comparison
     */
    #findNode(key: number): { parent: node | null, child: node | null }
    {
        // Find parent node of child with correct key
        let parent: node | null = null
        let current: node | null = this
        while (current !== null)
        {
            const comparison: number = key - current.getKey()
            if (comparison === 0)
            {
                break
            }
            else
            {
                parent = current
                current = (comparison < 0) ? current.getLeft() : current.getRight()
            }
        }

        return { parent, child: current }
    }

    #extractSuccessor(): { successor: node | null }
    {
        let successor: node | null = this.getRight()
        let successorParent: node = this
        let successorTemporary: node | null = null
        if (successor !== null)
        {
            // Find smallest number larger then removed node
            successorTemporary = successor.getLeft()
            let flag = true
            while (successorTemporary !== null)
            {
                flag = false
                successorParent = successor
                successor = successorTemporary
                successorTemporary = successorTemporary.getLeft()
            }

            // Successor: Move right child of successor up
            const childOld = successor.getRight()
            if (flag)
            {
                successorParent.setRight(childOld)
            }
            else
            {
                successorParent.setLeft(childOld)
            }
        }
        else 
        {
            // Find largest number smaller then removed node
            successor = this.getLeft()
            if (successor !== null)
            {
                successorTemporary = successor.getRight()
                let flag = true
                while (successorTemporary !== null)
                {
                    flag = false
                    successorParent = successor
                    successor = successorTemporary
                    successorTemporary = successorTemporary.getRight()
                }

                // Successor: Move left child of successor up
                const childOld = successor.getLeft()
                if (flag)
                {
                    successorParent.setLeft(childOld)
                }
                else
                {
                    successorParent.setRight(childOld)
                }
            }
        }

        if (successor !== null)
        {
            successor.setLeft(null)
            successor.setRight(null)
        }

        return { successor }
    }
}

export class bst
{
    #root: node | null = null
    constructor(key: number, value: gameState, left: node | null = null, 
                                               right: node | null = null)
    {
        const newRoot = new node(key, value, left, right)
        this.setRoot(newRoot)
    }

    add(key: number, value: gameState): boolean
    {
        const root = this.getRoot()
        if (root != null)
        {
            return root.add(key, value)
        }
        return false
    }

    search(key: number): node | null
    {
        const root = this.getRoot()
        if (root != null)
        {
            return root.search(key)
        }
        return null
    }

    delete(key: number): boolean
    {
        const root = this.getRoot()
        if (root != null)
        {
            const newRoot = root.delete(key)
            this.setRoot(newRoot)
            return true
        }
        return false
    }

    getRoot(): node | null
    {
        return this.#root
    }

    setRoot(node: node | null): void
    {
        this.#root = node
    }

    inorderTraversal()
    {
        const root = this.getRoot()
        if (root != null)
        {
           return root.inorderTraversal()
        }
    }
}

// let root: bst = new bst(7, null)
// root.add(2, null)
// root.add(3, null)
// root.add(9, null)
// root.add(8, null)
// root.add(10, null)
// console.log(root.inorderTraversal())
// Delete all
// root = root.delete(10)
// root = root.delete(8)
// root = root.delete(9)
// root = root.delete(3)
// root = root.delete(2)
// Delete root
// root = root.delete(7)
// console.log(root.inorderTraversal())
// root = root.delete(8)
//console.log(root.inorderTraversal())
