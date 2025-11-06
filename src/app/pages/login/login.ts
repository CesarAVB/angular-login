// login.component.ts
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginEntity } from '../../models/login';                         // Importa a entidade de login
import { LoginService } from '../../services/login';                      // Importa o serviço de login
import { ToastService } from '../../services/toast';                      // Importa o serviço de toast para exibir mensagens
import { ToastComponent } from '../../shared/components/toast/toast';     // Importa o componente de toast

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  login: LoginEntity = new LoginEntity();                       // Instancia a entidade de login
  constructor(private loginService: LoginService,               // Injeta o serviço de login
              private toastService: ToastService) {}            // Injeta o serviço do para utilizar o Toast

  private animationId: number | null = null;
  private particles: Particle[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private canvasWidth: number = 0;
  private canvasHeight: number = 0;
  private mouseX: number = 0;
  private mouseY: number = 0;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');

    if (!this.ctx) return;

    // Define o tamanho do canvas
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;

    // Cria as partículas
    this.createParticles();

    // Inicia a animação
    this.animate();

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('mousemove', this.handleMouseMove);
  }

  private createParticles(): void {
    const particleCount = 80;
    this.particles = [];

    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this.canvasWidth, this.canvasHeight));
    }
  }

  private connectParticles(): void {
    if (!this.ctx) return;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(156, 163, 175, ${0.4 * (1 - distance / 150)})`;
          this.ctx.lineWidth = 2;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  private animate = (): void => {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.particles.forEach((particle) => {
      particle.update(this.canvasWidth, this.canvasHeight, this.mouseX, this.mouseY);
      particle.draw(this.ctx!);
    });

    this.connectParticles();
    this.animationId = requestAnimationFrame(this.animate);
  };

  private handleResize = (): void => {
    const canvas = this.canvasRef.nativeElement;
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
  };

  private handleMouseMove = (event: MouseEvent): void => {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  };

  autenticarUsuario(): void {
    console.log('Dados do login:', this.login);                                               // Imprime os dados do login no console
    if (this.login.email && this.login.password) {                                            // Verifica se email e senha foram preenchidos
      this.loginService.realizarLogin(this.login.email, this.login.password).subscribe({      // Chama o serviço de login
        next: (response) => {                                                                 // Trata a resposta do login
          console.log('Login realizado', response);
          this.toastService.success('Login realizado com sucesso!');                          // Manda mensagem de sucesso via Toast
        },
        error: (erro) => {                                                                    // Trata erros de login
          console.error('Erro no login', erro);
          this.toastService.error('Credenciais inválidas. Tente novamente.');                 // Manda mensagem de erro via Toast
        },
      });
    } else {
      console.error('Email e senha são obrigatórios');                                        // Mensagem de erro se campos estiverem vazios
      this.toastService.warning('Email e senha são obrigatórios!');                           // Manda mensagem de aviso via Toast
    }
  }
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number = 2;
  baseVx: number;
  baseVy: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.baseVx = this.vx;
    this.baseVy = this.vy;
  }

  update(canvasWidth: number, canvasHeight: number, mouseX: number, mouseY: number): void {
    // Calcular distância do mouse
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 150;

    // Se o mouse está próximo, afastar a partícula
    if (distance < maxDistance) {
      const force = (maxDistance - distance) / maxDistance;
      this.vx = this.baseVx - (dx / distance) * force * 2;
      this.vy = this.baseVy - (dy / distance) * force * 2;
    } else {
      // Retornar gradualmente à velocidade base
      this.vx += (this.baseVx - this.vx) * 0.05;
      this.vy += (this.baseVy - this.vy) * 0.05;
    }

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvasWidth) {
      this.vx *= -1;
      this.baseVx *= -1;
    }
    if (this.y < 0 || this.y > canvasHeight) {
      this.vy *= -1;
      this.baseVy *= -1;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(156, 163, 175, 0.6)';
    ctx.fill();
  }
}
