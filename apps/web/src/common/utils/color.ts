// ActivityLog Type
export function getLogActionTypeColorClass(logActionType: string): string {
  switch (logActionType) {
    case 'UPDATED':
      return 'beryl-green';
    case 'DELETED':
      return 'alto';
    case 'INSERTED':
      return 'silver'; //coral-sunset, mint-cream, sky-gray, peach-blush.
    default:
      return 'powder-blue';
  }
}

// ActivityLog Type
export function getDateColorClass(
  dateString: string,
  duration: number,
): string {
  const date = new Date(dateString);
  const today = new Date();
  const veryFarFuture = new Date(today);
  veryFarFuture.setDate(today.getDate() + duration);
  const veryOldFromThePast = new Date(today);
  veryOldFromThePast.setDate(today.getDate() - duration);

  if (date >= veryFarFuture) {
    return 'color-very-far-future text-right';
  } else if (date >= today) {
    return 'color-near-future text-right';
  } else if (date <= veryOldFromThePast) {
    return 'color-very-old-past text-right';
  } else if (date <= today) {
    return 'color-near-past text-right';
  } else {
    return ''; // Default case if none of the conditions match
  }
}

// ActivityLog Type
export function getCapacityColorClass(capacity: number): string {
  if (capacity > 50) {
    return 'color-app-very-light-blue text-right';
  } else {
    return 'color-app-light-grey text-right'; // Default case if none of the conditions match
  }
}

export function getUserRoleColorClass(userRole: string): string {
  switch (userRole) {
    case 'admin':
      return 'beryl-green';
    case 'planner':
      return 'alto';
    case 'viewer':
      return 'silver'; //coral-sunset, mint-cream, sky-gray, peach-blush.
    default:
      return 'powder-blue';
  }
}

export function getTeamDayColorClass(region: string): string {
  switch (region) {
    case 'Monday':
      return 'beryl-green';
    case 'Tuesday':
      return 'silver';
    case 'Wednesday':
      return 'light-apricot';
    case 'Thursday':
      return 'cinderella';
    case 'Friday':
      return 'rose-fog';
    case 'Saturday':
      return 'lavender-mist';
    default:
      return 'powder-blue';
  }
}

export function getPopularSkillColorClass(languageLevel: string): string {
  switch (languageLevel) {
    // BE';
    case 'Java':
    case 'NodeJS':
      return 'powder-blue';
    // FE
    case 'ReactJS':
      return 'light-apricot';
  }
}

export function getLanguageLevelColorClass(languageLevel: string): string {
  switch (languageLevel) {
    // case 'B1':
    //   return 'beryl-green';
    case 'B2':
      return 'beryl-green';
    case 'C1':
      return 'powder-blue';
    case 'C2':
      return 'powder-blue';
    case 'Wa':
      return 'powder-blue';
    // case 'Friday':
    //   return 'rose-fog';
    // case 'Saturday':
    //   return 'lavender-mist';
    default:
      return '';
  }
}

export function getStaffingStatusColorClass(staffingStatus: string): string {
  switch (staffingStatus) {
    // Failed
    case 'Failed Interview Tech':
    case 'Failed Interview Eng':
      return 'failed';

    // Screening failed
    case 'Language Deficiency':
    case 'Cultural Misfit':
    case 'Failed Assessment':
    case 'Tech Disqualify':
      return 'light-failed';

    // In progress
    case 'Suggestion':
    case 'Considering':
    case 'Interviewing':
    case 'Proposing':
      return 'beryl-green';

    // Canceled
    case 'Client Cancel':
    case 'Process Cancel':
      return 'silver';

    // Closed
    case 'Released':
    case 'Offboarding':
    case 'Resigning':
    case 'Off Boarding':
      return 'silver';

    // Powder-blue
    case 'Passed Interview':
    case 'Assigned':
    case 'In Production':
      return 'powder-blue';

    // Default
    // default:
    //   return 'powder-blue'; // Or whatever default color you want
  }
}

export function getLocationRegionColorClass(region: string): string {
  switch (region) {
    case 'Europe':
      return 'beryl-green';
    case 'North America':
      return 'silver';
    case 'Asia Pacific':
      return 'light-apricot';
    // case 'Assigned':
    //   return 'cinderella';
    // case 'In Production':
    //   return 'rose-fog';
    // case 'Interviewing':
    //   return 'lavender-mist';
    default:
      return 'powder-blue';
  }
}

export function getProjectStatusColorClass(staffingStatus: string): string {
  switch (staffingStatus) {
    case 'Lost':
      return 'beryl-green';
    case 'Closed':
      return 'silver';
    case 'Running':
      return 'light-apricot';
    // case 'Assigned':
    //   return 'cinderella';
    // case 'In Production':
    //   return 'rose-fog';
    // case 'Interviewing':
    //   return 'lavender-mist';
    default:
      return 'powder-blue';
  }
}
