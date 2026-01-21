import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('API E2E Tests', () => {
	let app: INestApplication;
	let authToken: string;
	let userId: string;
	let eventId: string;
	let bookingQrCode: string;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true,
			}),
		);
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	describe('Auth Endpoints', () => {
		const testUser = {
			username: `testuser_${Date.now()}`,
			email: `test_${Date.now()}@example.com`,
			fullName: 'Test User',
			password: 'Password123!',
		};

		describe('POST /auth/sign-up', () => {
			it('should register a new user', () => {
				return request(app.getHttpServer())
					.post('/auth/sign-up')
					.send(testUser)
					.expect(201)
					.expect((res) => {
						expect(res.body).toHaveProperty('_id');
						expect(res.body).toHaveProperty('username', testUser.username);
						expect(res.body).toHaveProperty('email', testUser.email);
						expect(res.body).not.toHaveProperty('password');
						userId = res.body._id;
					});
			});

			it('should fail with duplicate username', () => {
				return request(app.getHttpServer())
					.post('/auth/sign-up')
					.send(testUser)
					.expect(409);
			});

			it('should fail with invalid email', () => {
				return request(app.getHttpServer())
					.post('/auth/sign-up')
					.send({
						...testUser,
						email: 'invalid-email',
					})
					.expect(400);
			});

			it('should fail with missing required fields', () => {
				return request(app.getHttpServer())
					.post('/auth/sign-up')
					.send({
						username: 'testuser',
					})
					.expect(400);
			});
		});

		describe('POST /auth/sign-in', () => {
			it('should login with valid credentials', () => {
				return request(app.getHttpServer())
					.post('/auth/sign-in')
					.send({
						usernameOrEmail: testUser.username,
						password: testUser.password,
					})
					.expect(200)
					.expect((res) => {
						expect(res.body).toHaveProperty('token');
						authToken = res.body.token;
					});
			});

			it('should login with email', () => {
				return request(app.getHttpServer())
					.post('/auth/sign-in')
					.send({
						usernameOrEmail: testUser.email,
						password: testUser.password,
					})
					.expect(200)
					.expect((res) => {
						expect(res.body).toHaveProperty('token');
					});
			});

			it('should fail with invalid password', () => {
				return request(app.getHttpServer())
					.post('/auth/sign-in')
					.send({
						usernameOrEmail: testUser.username,
						password: 'wrongpassword',
					})
					.expect(401);
			});

			it('should fail with non-existent user', () => {
				return request(app.getHttpServer())
					.post('/auth/sign-in')
					.send({
						usernameOrEmail: 'nonexistent',
						password: 'password',
					})
					.expect(401);
			});
		});
	});

	describe('Event Endpoints', () => {
		describe('GET /event', () => {
			it('should get all events', () => {
				return request(app.getHttpServer())
					.get('/event')
					.expect(200)
					.expect((res) => {
						expect(res.body).toHaveProperty('events');
						expect(res.body).toHaveProperty('totalEvents');
						expect(res.body).toHaveProperty('totalPages');
						expect(res.body).toHaveProperty('currentPage');
						expect(Array.isArray(res.body.events)).toBe(true);
					});
			});

			it('should support pagination', () => {
				return request(app.getHttpServer())
					.get('/event?page=1&limit=5')
					.expect(200)
					.expect((res) => {
						expect(res.body.currentPage).toBe(1);
						expect(res.body.events.length).toBeLessThanOrEqual(5);
					});
			});

			it('should support search', () => {
				return request(app.getHttpServer())
					.get('/event?search=test')
					.expect(200)
					.expect((res) => {
						expect(res.body).toHaveProperty('events');
					});
			});

			it('should support filtering by mode', () => {
				return request(app.getHttpServer())
					.get('/event?mode=online')
					.expect(200)
					.expect((res) => {
						expect(res.body).toHaveProperty('events');
					});
			});

			it('should support sorting', () => {
				return request(app.getHttpServer())
					.get('/event?sort=desc')
					.expect(200)
					.expect((res) => {
						expect(res.body).toHaveProperty('events');
					});
			});
		});

		describe('POST /event', () => {
			it('should create event with authentication', async () => {
				const eventData = {
					title: `Test Event ${Date.now()}`,
					description: 'Test Description',
					slug: `test-event-${Date.now()}`,
					date: new Date('2026-03-01').toISOString(),
					location: 'Test Location',
					organizer: 'Test Organizer',
					mode: 'offline',
					tags: JSON.stringify(['tech', 'conference']),
					agenda: JSON.stringify([]),
					maxAttendees: 100,
				};

				return request(app.getHttpServer())
					.post('/event')
					.set('Authorization', `Bearer ${authToken}`)
					.field('title', eventData.title)
					.field('description', eventData.description)
					.field('slug', eventData.slug)
					.field('date', eventData.date)
					.field('location', eventData.location)
					.field('organizer', eventData.organizer)
					.field('mode', eventData.mode)
					.field('tags', eventData.tags)
					.field('agenda', eventData.agenda)
					.field('maxAttendees', eventData.maxAttendees)
					.expect(201)
					.expect((res) => {
						expect(res.body).toHaveProperty('_id');
						expect(res.body).toHaveProperty('title', eventData.title);
						expect(res.body).toHaveProperty('slug', eventData.slug);
						eventId = res.body._id;
					});
			});

			it('should fail without authentication', () => {
				return request(app.getHttpServer()).post('/event').expect(401);
			});

			it('should fail with duplicate slug', async () => {
				const eventData = {
					title: 'Duplicate Event',
					description: 'Test Description',
					slug: `test-event-${Date.now()}`,
					date: new Date('2026-03-01').toISOString(),
					location: 'Test Location',
					organizer: 'Test Organizer',
					mode: 'offline',
					tags: JSON.stringify(['tech']),
					agenda: JSON.stringify([]),
					maxAttendees: 100,
				};

				await request(app.getHttpServer())
					.post('/event')
					.set('Authorization', `Bearer ${authToken}`)
					.field('title', eventData.title)
					.field('description', eventData.description)
					.field('slug', eventData.slug)
					.field('date', eventData.date)
					.field('location', eventData.location)
					.field('organizer', eventData.organizer)
					.field('mode', eventData.mode)
					.field('tags', eventData.tags)
					.field('agenda', eventData.agenda)
					.field('maxAttendees', eventData.maxAttendees)
					.expect(201);

				return request(app.getHttpServer())
					.post('/event')
					.set('Authorization', `Bearer ${authToken}`)
					.field('title', eventData.title)
					.field('description', eventData.description)
					.field('slug', eventData.slug)
					.field('date', eventData.date)
					.field('location', eventData.location)
					.field('organizer', eventData.organizer)
					.field('mode', eventData.mode)
					.field('tags', eventData.tags)
					.field('agenda', eventData.agenda)
					.field('maxAttendees', eventData.maxAttendees)
					.expect(409);
			});
		});

		describe('GET /event/:id', () => {
			it('should get event by ID', () => {
				return request(app.getHttpServer())
					.get(`/event/${eventId}`)
					.expect(200)
					.expect((res) => {
						expect(res.body).toHaveProperty('_id', eventId);
						expect(res.body).toHaveProperty('title');
					});
			});

			it('should return 404 for non-existent event', () => {
				return request(app.getHttpServer())
					.get('/event/nonexistent-id')
					.expect(404);
			});
		});
	});

	describe('Booking Endpoints', () => {
		const bookingData = {
			name: 'Test Attendee',
			email: `attendee_${Date.now()}@example.com`,
		};

		describe('POST /event/:id/book', () => {
			it('should create a booking', () => {
				return request(app.getHttpServer())
					.post(`/event/${eventId}/book`)
					.send(bookingData)
					.expect(201)
					.expect((res) => {
						expect(res.body).toHaveProperty('_id');
						expect(res.body).toHaveProperty('name', bookingData.name);
						expect(res.body).toHaveProperty('email', bookingData.email);
						expect(res.body).toHaveProperty('qrCode');
						bookingQrCode = res.body.qrCode;
					});
			});

			it('should fail with duplicate booking', () => {
				return request(app.getHttpServer())
					.post(`/event/${eventId}/book`)
					.send(bookingData)
					.expect(409);
			});

			it('should fail with invalid event ID', () => {
				return request(app.getHttpServer())
					.post('/event/nonexistent/book')
					.send(bookingData)
					.expect(404);
			});

			it('should fail with missing required fields', () => {
				return request(app.getHttpServer())
					.post(`/event/${eventId}/book`)
					.send({ name: 'Test' })
					.expect(400);
			});
		});

		describe('POST /event/:id/checkin', () => {
			it('should check in with valid QR code', () => {
				const qrData = bookingQrCode.split(',')[1];

				return request(app.getHttpServer())
					.post(`/event/${eventId}/checkin`)
					.send({ qrData })
					.expect(200)
					.expect((res) => {
						expect(res.body).toHaveProperty('id');
						expect(res.body).toHaveProperty('name', bookingData.name);
						expect(res.body).toHaveProperty('email', bookingData.email);
						expect(res.body).toHaveProperty('checkedInAt');
					});
			});

			it('should fail with invalid QR code', () => {
				return request(app.getHttpServer())
					.post(`/event/${eventId}/checkin`)
					.send({ qrData: 'invalid-qr-code' })
					.expect(400);
			});
		});
	});

	describe('User Endpoints', () => {
		describe('GET /user', () => {
			it('should get all users', () => {
				return request(app.getHttpServer())
					.get('/user')
					.expect(200)
					.expect((res) => {
						expect(Array.isArray(res.body)).toBe(true);
						if (res.body.length > 0) {
							expect(res.body[0]).not.toHaveProperty('password');
						}
					});
			});
		});
	});
});
