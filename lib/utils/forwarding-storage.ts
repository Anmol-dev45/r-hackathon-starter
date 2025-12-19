// In-memory storage for complaint forwarding mappings
// Format: { "complaint_id": "office_id" }

export const complaintForwardingMap: Record<string, string> = {};

/**
 * Add a complaint forwarding mapping
 */
export function addForwarding(complaintId: string, officeId: string) {
    complaintForwardingMap[complaintId] = officeId;
}

/**
 * Get the office ID for a complaint
 */
export function getForwarding(complaintId: string): string | undefined {
    return complaintForwardingMap[complaintId];
}

/**
 * Get all forwarding mappings
 */
export function getAllForwardings(): Record<string, string> {
    return { ...complaintForwardingMap };
}

/**
 * Clear all forwarding mappings (for testing)
 */
export function clearForwardings() {
    Object.keys(complaintForwardingMap).forEach(key => {
        delete complaintForwardingMap[key];
    });
}
