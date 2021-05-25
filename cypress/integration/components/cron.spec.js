const { get } = require('http');

describe('Cron', () => {
  before(() => {
    cy.visit('/');
    cy.get('.loader').should('not.exist', { timeout: 20000 });
    cy.get('.ngx-section-toggle > .icon-arrow-right').click();
  });

  describe('Periods', () => {
    beforeEach(() => {
      cy.get('ngx-cron-input').as('CRON');
      cy.get('@CRON').find('.ngx-button').eq(0).as('SECONDLY');
      cy.get('@CRON').find('.ngx-button').eq(1).as('MINUTELY');
      cy.get('@CRON').find('.ngx-button').eq(2).as('HOURLY');
      cy.get('@CRON').find('.ngx-button').eq(3).as('DAILY');
      cy.get('@CRON').find('.ngx-button').eq(4).as('WEEKLY');
      cy.get('@CRON').find('.ngx-button').eq(5).as('MONTHLY');
      cy.get('@CRON').find('.ngx-button').eq(6).as('YEARLY');
      cy.get('@CRON').find('.ngx-button').eq(7).as('CUSTOM');
      cy.get('.date-selection').as('SELECTION');
    });

    it('Defaults to Minutely', () => {
      cy.get('@MINUTELY').should('contain', 'Minutely').should('have.class', 'btn-primary');
    });

    it('Render buttons for all periods', () => {
      cy.get('@SECONDLY').should('contain', 'Secondly');
      cy.get('@HOURLY').should('contain', 'Hourly');
      cy.get('@DAILY').should('contain', 'Daily');
      cy.get('@WEEKLY').should('contain', 'Weekly');
      cy.get('@MONTHLY').should('contain', 'Monthly');
      cy.get('@YEARLY').should('contain', 'Yearly');
      cy.get('@CUSTOM').should('contain', 'Custom');
    });

    it('Displays date time input for Daily', () => {
      cy.get('@DAILY').click();
      cy.get('@SELECTION').find('ngx-date-time').should('exist');
    });

    it('Displays date time input and select for Weekly', () => {
      cy.get('@WEEKLY').click();
      cy.get('@SELECTION').find('ngx-date-time').should('exist');
      cy.get('@SELECTION').find('ngx-select').should('exist');
    });

    it('Displays days of the week', () => {
      cy.get('@WEEKLY').click();
      cy.get('@SELECTION').find('ngx-select').as('DAYS_OF_WEEK').click();
      cy.get('@DAYS_OF_WEEK')
        .find('.ngx-select-dropdown-options')
        .within(() => {
          cy.get('li.ngx-select-dropdown-option').eq(0).should('contain', 'Sunday');
          cy.get('li.ngx-select-dropdown-option').eq(1).should('contain', 'Monday');
          cy.get('li.ngx-select-dropdown-option').eq(2).should('contain', 'Tuesday');
          cy.get('li.ngx-select-dropdown-option').eq(3).should('contain', 'Wednesday');
          cy.get('li.ngx-select-dropdown-option').eq(4).should('contain', 'Thursday');
          cy.get('li.ngx-select-dropdown-option').eq(5).should('contain', 'Friday');
          cy.get('li.ngx-select-dropdown-option').eq(6).should('contain', 'Saturday');
        });
    });

    it('Displays date time input and select for Monthly', () => {
      cy.get('@MONTHLY').click();
      cy.get('@SELECTION').find('ngx-date-time').should('exist');
      cy.get('@SELECTION').find('ngx-input').should('exist');
    });

    it('Displays date time input and select for Yearly', () => {
      cy.get('@YEARLY').click();
      cy.get('@SELECTION').find('ngx-date-time').should('exist');
      cy.get('@SELECTION').find('ngx-input').should('exist');
      cy.get('@SELECTION').find('ngx-select').should('exist');
    });

    it('Displays months', () => {
      cy.get('@YEARLY').click();
      cy.get('@SELECTION').find('ngx-select').as('MONTHS').click();
      cy.get('@MONTHS')
        .find('.ngx-select-dropdown-options')
        .within(() => {
          cy.get('li.ngx-select-dropdown-option').eq(0).should('contain', 'January');
          cy.get('li.ngx-select-dropdown-option').eq(1).should('contain', 'February');
          cy.get('li.ngx-select-dropdown-option').eq(2).should('contain', 'March');
          cy.get('li.ngx-select-dropdown-option').eq(3).should('contain', 'April');
          cy.get('li.ngx-select-dropdown-option').eq(4).should('contain', 'May');
          cy.get('li.ngx-select-dropdown-option').eq(5).should('contain', 'June');
          cy.get('li.ngx-select-dropdown-option').eq(6).should('contain', 'July');
          cy.get('li.ngx-select-dropdown-option').eq(7).should('contain', 'August');
          cy.get('li.ngx-select-dropdown-option').eq(8).should('contain', 'September');
          cy.get('li.ngx-select-dropdown-option').eq(9).should('contain', 'October');
          cy.get('li.ngx-select-dropdown-option').eq(10).should('contain', 'November');
          cy.get('li.ngx-select-dropdown-option').eq(11).should('contain', 'December');
        });
    });
  });

  describe('Inputs', () => {
    beforeEach(() => {
      cy.get('ngx-cron-input').as('CRON');
    });

    it('Changes bellow caption after language is changed', () => {
      cy.get('@CRON').find('.language-expression').as('CAPTION');
      cy.get('@CAPTION').should('contain', 'A las 12:00 AM, el día 1 del mes, sólo en enero');
      cy.get('ngx-select').eq(1).as('LANGUAGES-INPUT');
      cy.get('@LANGUAGES-INPUT').should('contain', 'Available languages');
      cy.get('@LANGUAGES-INPUT').find('ngx-select-input').click();
      cy.get('@LANGUAGES-INPUT').find('.ngx-select-dropdown-option').as('LANGUAGES');
      cy.get('@LANGUAGES').eq(5).click();
      cy.get('@CAPTION').should('contain', 'Um 12:00 AM, an Tag 1 des Monats, nur im Januar');
    });

    it('Disables/Enables cron input when disabled/enabled', () => {
      cy.get('.ngx-toggle').eq(0).as('DISABLE-TOGGLE');
      cy.get('@DISABLE-TOGGLE').should('contain', 'Disabled');
      cy.get('@DISABLE-TOGGLE').find('.ngx-x').click({ force: true });
      cy.get('@CRON').should('have.attr', 'disabled', 'disabled');
      cy.get('@DISABLE-TOGGLE').find('.ngx-check').click({ force: true });
    });

    it('Removes/Adds Secondly when quartz are disabled/enabled', () => {
      cy.get('.ngx-toggle').eq(1).as('DISABLE-QUARTZ');
      cy.get('@DISABLE-QUARTZ').should('contain', 'Disable Quartz');
      cy.get('@CRON').find('.ngx-button').should('have.length', 8);
      cy.get('@DISABLE-QUARTZ').find('.ngx-x').click({ force: true });
      cy.get('@CRON').find('.ngx-button').should('have.length', 7);
      cy.get('@DISABLE-QUARTZ').find('.ngx-check').click({ force: true });
      cy.get('@CRON').find('.ngx-button').should('have.length', 8);
    });

    it('Changes cron periods depending on the input', () => {
      cy.get('ngx-select').first().as('PERIODS-INPUT');
      cy.get('@PERIODS-INPUT').should('have.attr', 'label', 'Available Periods');
      cy.get('@PERIODS-INPUT').find('.ngx-select-input-option').as('PERIODS');
      cy.get('@PERIODS').first().find('.ngx-select-clear').click();
      cy.get('@PERIODS').last().find('.ngx-select-clear').click();
      cy.get('@CRON').find('.ngx-button').should('have.length', 6);
    });
  });
});
